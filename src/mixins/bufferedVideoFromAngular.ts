import { HttpClient } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Logger } from '@tsvetnoy/utils';

export function detectIE() {
  return navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/));
}

export function videoPlayAbortErrorHandlePromise(playPromise: Promise<void>) {
  if (playPromise) {
    playPromise.catch(videoPlayAbortErrorHandler);
  }
}


const log = Logger.create('detached-source-buffer', false);

export function videoPlayAbortErrorHandler(error) {
  if (error.name === 'AbortError') {
    return Promise.resolve();
  } else {
    // console.log('video error handled, silently ang gently');
    // console.dir(error);
    return Promise.resolve(error);
  }
}


export interface BufferableVideo {
  /**
   * URL до видео
   */
  src: string;
  /**
   * Строка с майм тайпом и кодеками,
   * вида: `video/mp4; codecs="avc1.42C09D"`
   * */
  type: string;
  duration: number;
}

interface Fragment {
  id: number;
  /**
   * Начальный байт фрагмента
   */
  start: number;
  /**
   * Конечный байт фрагмента
   */
  end: number;
  startTime?: number;
  endTime?: number;
  isLoading?: boolean;
  isLoaded?: boolean;
  isAttaching?: boolean
  isAttached?: boolean;
  buffer?: ArrayBuffer;
  size?: number;
}

interface QueuedTask {
  operation: 'add' | 'remove' | 'close';
  fragment: Fragment;
}

interface FetchedFragment {
  /**
   * Загруженный arrayBuffer
   */
  buffer: ArrayBuffer;
  /**
   * Общее количество байт в видео
   */
  range: number;
  fragment: Fragment;
}


/**
 *
 *
 * @export
 * @class SourceBuffer
 */
export class DetachedSourceBuffer {
  fragmentSize = 1024 * 1024 * 2;
  totalSize = 0;

  /**
   * Количество секунд, которые мы буферезируем наперед
   */
  bufferAhead = 5;
  fragments: Fragment[] = [];
  queue: QueuedTask[] = [];
  element: HTMLVideoElement;

  mediaSource: MediaSource;
  sourceBuffer: SourceBuffer;

  ready: Promise<any>;

  _onSourceOpen: () => any;
  _onCanPlay: () => any;
  _onUpdate: () => any;
  _onTimeUpdate: () => any;
  _onUpdateEndStream: () => any;
  /**
   * - Загружаем первый фрагмент видео
   * - Расчитываем оставшиеся фрагаменты
   */
  constructor (private video: BufferableVideo, private http: HttpClient, private id?: string) {
    log('init');
    const fragment = this.fragments[0] = <Fragment>{
      start: 0,
      end: this.fragmentSize,
      size : this.fragmentSize,
    }

    this.ready = this.fetchFragment(0)
      .then(({ buffer, range }) => {
        // console.log('initial fragment loaded');
        this.totalSize = range;
        if (!fragment) {
          // console.log('нет фрагмента');
          return;
        }
        fragment.buffer = buffer;
        this.createFragments(range);
      })
      .catch(() => {});

      this._onSourceOpen = this.onSourceOpen.bind(this);
      this._onCanPlay = this.onCanPlay.bind(this);
      this._onUpdate = this.onUpdate.bind(this);
      this._onTimeUpdate = this.onTimeUpdate.bind(this);
      this._onUpdateEndStream = this.onUpdateEndStream.bind(this);
  }

  static isSupported(type) {
    return 'MediaSource' in window && MediaSource && MediaSource.isTypeSupported(type) && !detectIE();
  }

  destroy() {
    this.detachFromVideo();
    this.clearBuffer();

    this.ready = null;
    this._onSourceOpen = null;
    this._onCanPlay = null;
    this._onUpdate = null;
    this._onTimeUpdate = null;
    this._onUpdateEndStream = null;

    this.fragments = null;
    this.queue = null;
    this.fragmentSize = null;
    this.bufferAhead = null;

  }
  /**
   * Обработчики событий, нужны тут чтобы их удалять при детаче
   */
  onCanPlay() {
    this.applyTimeToFragments();
    this.element.addEventListener('timeupdate', this._onTimeUpdate);
  }
  onUpdate(event) {
    log('буффер добавился', event);
    // console.log('SOURCE BUFFER UPDATED', this.element.paused);

    // Если в медиасорс добавился буффер, но видео не плей (закисло и не дождалось)
    if (this.element && this.element.paused) {
      videoPlayAbortErrorHandlePromise(this.element.play());
    }
    window.requestAnimationFrame(() => {
      this.queueQueue();
    });
  }
  onTimeUpdate() { this.checkForLoading(); }
  onUpdateEndStream() { this.closeBuffer(); }

  onSourceOpen() {
    // console.log('SOURCEOPEN');
    if (this.mediaSource.readyState !== 'open') {
      return;
    }

    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.video.type);
    this.sourceBuffer.addEventListener('update', this._onUpdate);

    this.sourceBuffer.addEventListener('abort', event => log('abort', event))
    this.sourceBuffer.addEventListener('updatestart', event => log('updatestart', event))
    this.sourceBuffer.addEventListener('updateend', event => log('updateend', event))
    this.sourceBuffer.addEventListener('error', function(event) {
      // arguments;
      // debugger;
      log('error', event)
    })

    debugger
    this.fragments.filter(fragment => fragment.buffer).map(fragment => this.appendToBuffer(fragment));
  }

  /**
   * - Аттачим к реальному видео
   * - Навешиваем обработчики
   */
  public attachToVideo(video: HTMLVideoElement) {
    this.element = video;

    this.mediaSource = new MediaSource();
    this.element.src = URL.createObjectURL(this.mediaSource);
    // console.log('ATTACH');

    // this.element.playbackRate = 5;

    this.mediaSource.addEventListener('sourceopen', this._onSourceOpen)
    this.element.addEventListener('canplay', this._onCanPlay, { once: true });
  }

  /**
   * Детачимся от реального видео
   */
  public detachFromVideo() {
    if (this.fragments) {
      this.fragments.forEach(fragment => fragment.isAttached = false);
    }
    this.queue = [];

    if (this.element) {
      URL.revokeObjectURL(this.element.src);
      this.element.removeEventListener('timeupdate', this._onTimeUpdate);
      this.element.removeEventListener('canplay', this._onCanPlay);
    }

    if (this.sourceBuffer) {
      this.sourceBuffer.removeEventListener('update', this._onUpdate);
      this.sourceBuffer.removeEventListener('update', this._onUpdateEndStream);

      if (this.mediaSource) {
        if (this.mediaSource.readyState === 'open') {
          try {
            this.sourceBuffer.abort();
          } catch (e) {
            console.error('Произошла ошибка при вызове sourceBuffer.abort', e);
          }
        }

        if (this.sourceBuffer) {
          try {
            this.mediaSource.removeSourceBuffer(this.sourceBuffer);
          } catch (e) {
            // console.log('Произошла ошибка при удалении буфера', e);
          }
        }

        this.mediaSource.removeEventListener('sourceopen', this._onSourceOpen)
      }
    }

    this.element = null;
    this.mediaSource = null;
    this.sourceBuffer = null;
  }

  private fetchFragment(fragmentId: number): Promise<FetchedFragment> {
    const fragment = this.fragments[fragmentId];
    fragment.isLoading = true;

    return this.http.get(this.video.src, {
        headers: {
          range: `bytes=${fragment.start}-${fragment.end}`,
        },
        withCredentials: false,
        responseType: 'arraybuffer',
        observe: 'response'
      })
      .pipe(
        retry(3),
        map((response) => {
          fragment.buffer = response.body;
          fragment.isLoaded = true;
          fragment.isLoading = false;
          // console.log('BR: ', response.headers.get('Content-Range'), fragmentId, this.video.src);
          return {
            range: parseInt(response.headers.get('Content-Range').split('/')[1], 10),
            buffer: fragment.buffer,
            fragment
          }
        }),
        catchError(() => EMPTY),
      )
      .toPromise()
      .then((v) => {
        if (!v) {
          throw new Error('Пустой обьект');
        }
        return v;
      })
  }


  /**
   * Создаем все упущенные фрагменты
   */
  private createFragments(_range) {
    const range = _range - this.fragmentSize;
    const fragmentsCount = Math.ceil(range / this.fragmentSize);

    if (!this.fragments) {
      return;
    }

    for (let i = 1; i <= fragmentsCount; i++) {
      const startByte = i * this.fragmentSize + 1;
      const endByte = (i + 1) * this.fragmentSize;

      this.fragments.push(<Fragment>{
        start: startByte,
        end: endByte < _range ? endByte : _range,
        size: (endByte < _range ? endByte : _range) - startByte,
      })
    }

    this.fragments.forEach((fragment, id) => {
      fragment.id = id;
    });
  }

  /**
   * Прикидочно раставляем по фрагментам их время
   */
  private applyTimeToFragments() {

    this.fragments.forEach(fragment => {
      fragment.startTime = this.video.duration * (fragment.start / this.totalSize);
      fragment.endTime = this.video.duration * (fragment.end / this.totalSize);
    });
  }

  play() {
    if (!this.element) {
      return;
    }

    // Видео стейты
    const HAVE_NOTHING = 0 // no information whether or not the video is ready
    const HAVE_METADATA = 1 // metadata for the video is ready
    const HAVE_CURRENT_DATA = 2 // data for the current playback position is available, but not enough data to play next frame/millisecond
    const HAVE_FUTURE_DATA = 3 // data for the current and at least the next frame is available
    const HAVE_ENOUGH_DATA = 4 // enough data available to start playing


    if (this.element.readyState >= HAVE_FUTURE_DATA) {
      this.element.addEventListener('canplay', () => {
        this.play();
      });
    }
    videoPlayAbortErrorHandlePromise(this.element.play());
  }

  /**
   * Чекаем в каком мы сейчас тайминге,
   * и стоит ли грузить текущий/следующий фрагмент
   */
  private checkForLoading() {
    log('checkForLoading');
    if (!this.element) {
      return;
    }

    log('checking...');
    const currentTime = this.element.currentTime;

    // Если есть заатаченные фрагменты, которые следует удалить из буфера
    this.fragments.filter(fragment => fragment.isAttached).forEach(fragment => {
      // Если фрагмент остался на 1 секунду позади
      if (fragment.endTime + 1 < currentTime) {
        this.removeFromBuffer(fragment);
      }

      // Если фрагмент остался на 5 секунд спереди
      if (fragment.startTime - this.bufferAhead > currentTime) {
        this.removeFromBuffer(fragment);
      }
    });

    // Ищем текущий и следующий фрагмент и убеждаемся, что они заатачены

    log('все фрагменты', this.fragments);
    const fragmentsToBeWarmedUp = this.fragments.filter(fragment => {
      // Текущий фрагмент
      if (fragment.startTime < currentTime && currentTime < fragment.endTime) {
        return true;
      }
      // Фрагменты, которые должны быть загружены на опережение
      if (fragment.startTime - this.bufferAhead < currentTime) {
        return true;
      }

      return false;
    });
    log('фрагменты что должны быть прогреты', fragmentsToBeWarmedUp);
    const fragmentsToLoad = fragmentsToBeWarmedUp.filter(fragment => !fragment.isLoading && !fragment.isAttached && !fragment.isAttaching)
    log('фрагменты на прогрузку', fragmentsToBeWarmedUp);


    fragmentsToLoad.map(fragment => this.loadAndAppendToBuffer(fragment));
  }

  /**
   * Убеждаемся, что фрагмент загружен и добавляем в буффер
  */
  loadAndAppendToBuffer(fragment) {
    log('грузить фрагмент', fragment);
    if (fragment.isLoaded) {
      this.appendToBuffer(fragment)
    } else {
      this.fetchFragment(fragment.id).then(() => {
        this.appendToBuffer(fragment);
      });
    }
  }

  /**
   * Добавляем в буффер
  */
  private appendToBuffer(fragment: Fragment) {
    if (!this.queue) {
      return;
    }

    this.queue.push({
      operation: 'add',
      fragment,
    });

    if (this.sourceBuffer && !this.sourceBuffer.updating) {
      this.queueQueue();
    }
  }

  /**
   * Удаляем из буффера лишние фрагменты (проигранные)
   */
  private removeFromBuffer(fragment: Fragment) {
    if (!this.queue) {
      return;
    }

    this.queue.push({
      operation: 'remove',
      fragment,
    });

    if (this.sourceBuffer && !this.sourceBuffer.updating) {
      this.queueQueue();
    }
  }

  private closeBuffer() {
    if (!this.queue) {
      return;
    }

    this.queue.push({
      operation: 'close',
      fragment: null,
    });

    if (this.sourceBuffer && !this.sourceBuffer.updating) {
      this.queueQueue();
    }
  }

  /**
   * Удаляем из буффера лишние фрагменты (проигранные)
   */
  public clearBuffer() {
    if (!this.fragments) {
      return;
    }

    this.fragments.forEach(fragment => {
      fragment.buffer = null;
      delete fragment.buffer;
    });
  }

  /**  */
  private queueQueue() {
    log(this.queue)
    debugger
    if (!this.queue || !this.queue.length) {
      return;
    }

    // Если по какой-то причине буфер занят, то ждем пока он закончит
    if (this.sourceBuffer.updating) {
      return;
    }

    // Если по какой-то причине у видео ошибка, то ничего не делаем (такого требует спека)
    if (this.element.error) {
      return;
    }

    const task = this.queue.shift();

    if (task.operation === 'add') {
      log('добавляем буффер', task.fragment.id);

      const buffers = Array.prototype.slice.call(this.mediaSource.sourceBuffers,0, 1000);

      log('bufferState', {
        updating: this.sourceBuffer.updating,
        isIn: buffers.indexOf(this.sourceBuffer),
        error: this.element.error,
      });
      this.sourceBuffer.appendBuffer(task.fragment.buffer);
      task.fragment.isAttached = true;
      if (this.fragments.every(fragment => fragment.isAttached)) {
        if (this.sourceBuffer) {
          this.sourceBuffer.addEventListener('update', this._onUpdateEndStream, { once: true });
        }
      }
    }
    if (task.operation === 'close') {

      if (this.element.readyState >= 1 && this.mediaSource.readyState === 'open') {
        this.mediaSource.endOfStream();
      }
    }

    if (task.operation === 'remove') {
      // console.log('QUEUE RUN REMOVE', task.fragment.id);
      //  if (this.sourceBuffer) {
        // this.sourceBuffer.remove(task.fragment.start, task.fragment.end);
      // }
      // task.fragment.isAttached = false;
    }
  }
}
