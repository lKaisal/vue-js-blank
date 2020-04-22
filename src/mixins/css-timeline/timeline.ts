
import { forkJoin, from as rxFrom, fromEvent, merge, interval, of } from "rxjs";
import { mapTo, take, tap, filter } from "rxjs/operators";
import { transitionCancelEventName, transitionEndEventName } from "./helpers";

export interface CSSProperties {
  [property: string]: string | number;
}

export interface AnimationDeclaration {
  el: HTMLElement;
  time: number;
  from: CSSProperties;
  to: CSSProperties;
  delay: number;
}

export interface CSSTimelineOptions {
  /** CSS изинг с которым будет рендерится анимация */
  ease?: string;
  /** Стоит ли прибраться таймлайну за собой (по умолчанию нет) */
  cleanup?: boolean;
  /** Через сколько стоит прибираться, используется, когда нужно отложить уборочку, по умолчанию ноль */
  cleanupDelay?: number;
  /** Ускоряет замедляет таймлайн */
  timeScale?: number;
}

export class CSSTimeline {
  private list: AnimationDeclaration[] = [];
  private opts: CSSTimelineOptions;
  private isCompiled = false;

  public static set(el: HTMLElement, props: CSSProperties) {
    return this.setProperties(el, props);
  }



  private static setProperties(el: HTMLElement, props: CSSProperties) {
    if (!el) {
      return;
    }
    Object.keys(props)
      .filter(property => property !== 'ease')
      .forEach(property => {
        el.style.setProperty(property, props[property].toString());
      });
  }

  private static removeProperties(el: HTMLElement, props: CSSProperties) {
    el.style.removeProperty('transition');

    Object.keys(props)
      .filter(property => property !== 'ease')
      .forEach(property => {
        el.style.removeProperty(property);
      });
  }

  constructor(opts: CSSTimelineOptions = { ease: 'ease-in-out' }) {
    this.opts = opts;
    return this;
  }

  /** Метод, очень похожий на гринсоковский интерфейс для обьявления анимаций,
   * единственное отличие надо в css стиле обьявляет туда-сюда анимации
   */
  to(el: HTMLElement, time: number, from: CSSProperties, to: CSSProperties, delay: number = 0) {
    this.list.push({ el, time, from, to, delay })
    return this;
  }

  staggerTo(els: HTMLElement[], time: number, from: CSSProperties, to: CSSProperties, stagger: number = 0, delay: number = 0) {
    let offset = 0;

    els.forEach(el => {
      this.to(el, time, from, to, delay + offset);
      offset += stagger;
    });

    return this;
  }

  setAnimation(el: HTMLElement, from: CSSProperties, time: number, delay: number) {
    const easing = from.ease || this.opts.ease ||  'ease-in-out';
    const timeScale = this.opts.timeScale || 1;

    const timing = `${time * timeScale}s ${easing} ${delay * timeScale}s`;
    const transition = Object.keys(from)
      .filter(property => ['transform', 'opacity', 'left', 'right', 'top', 'bottom', 'outline-width'].indexOf(property) !== -1)
      .map(property => `${property} ${timing}`)
      .filter(value => !!value)
      .join(', ');

    el.style.transition = transition;
  }

  public async compile() {
    this.list.forEach(declaration => {
      if (declaration.el) {
        CSSTimeline.setProperties(declaration.el, declaration.from);
      }
    });
    this.isCompiled = true;

    return Promise.resolve();
  }

  public async play(): Promise<any> {
    if (!this.isCompiled) {
      await this.compile();
      await this.waitForKeyFrames();
    }

    return new Promise(resolve => {
      const obs = this.list
        .map(declaration => {
          if (!declaration.el) {
            return of(true);
          }

          CSSTimeline.setProperties(declaration.el, declaration.to);
          this.setAnimation(declaration.el, declaration.from, declaration.time, declaration.delay);
          const timeScale = this.opts.timeScale || 1;
          const timing = (declaration.delay + declaration.time) * 1.1 * (timeScale);

          return merge(
            merge(
              fromEvent(declaration.el, transitionEndEventName()),
              fromEvent(declaration.el, transitionCancelEventName()),
            ).pipe(
              filter((event: TransitionEvent) => event.currentTarget === event.srcElement) // не реагируем на вложенные ивенты
            ),
            interval(timing * 1000).pipe(take(1)), // Может случится ситуация, что ивент не наступил, тогда сами сбросим
          ).pipe(
            take(1),
            mapTo(true),
            tap(() => {
              if (this.opts.cleanup) {
                interval(this.opts.cleanupDelay || 1).pipe(
                  take(1),
                  filter(() => document.body.contains(declaration.el))
                ).subscribe(() => {
                  CSSTimeline.removeProperties(declaration.el, declaration.from);
                })
              } else {
                declaration.el.style.removeProperty('transition');
              }
            })
        );
        });

      forkJoin(obs).subscribe(() => {
        resolve(true);
      });
    });
  }

  public clear() {
    const obs = this.list.map(declaration => {
      CSSTimeline.removeProperties(declaration.el, declaration.from);
    });
  }

  private async waitForKeyFrames(): Promise<any> {
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          resolve(true);
        });
      });
    })
  }

  /** Промис лайк обертка */
  public async then(callback:() => any = () => true): Promise<any> {
    return this.play().then(callback);
  }

  /** Стримлайк обертка */
  public asObservable() {
    return rxFrom(this.then());
  }
}
