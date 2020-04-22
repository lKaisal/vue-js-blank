created() {
  await preloadVideo('/videos/office.mp4')
    // .then((video: HTMLVideoElement) => {
    //   console.log(video)
    //   const type = 'video/mp4; codecs="avc1.640828"';
    //   const src = '/videos/office.mp4';
    //   const duration = video.duration;
    //   const image = video.poster;

    //   log('видео', src);

    //   if (DetachedSourceBuffer.isSupported(type)) {
    //     log('полноформатное видео на mediasource');
    //     this.buffer = new DetachedSourceBuffer({ src, type, duration }, 'http', 'main');
    //     console.log(this.buffer)
    //     // this.createVideoFromBuffer({ src, type, image });
    //   } else {
    //     // log('упрощеное видео с video тегом');
    //     // this.createVideoFromScratch({ src, image });
    //   }
    // })
}

methods: {
  createVideoFromScratch({ src, image, imageblur }) {
    // const video = document.createElement('video');
    const poster = document.createElement('img');

    // video.src = src;
    // video.loop = true;
    // video.muted = true;
    // video['playsinline'] = true;
    // video.style.setProperty('will-change', 'transform');

    poster.className = 'video-poster';
    poster.src = imageblur;

    const newImage = document.createElement('img');
    newImage.onload = () => {
      poster.src = image;
    }
    newImage.src = image;

    const html = `
    <video
      src="${src}"
      autoplay="autoplay"
      loop="loop"
      muted="muted"
      playsinline=""
      disableremoteplayback=""
      >
    </video>`;

    this.container.nativeElement.innerHTML = html;
    const video = this.container.nativeElement.querySelector('video');
    this.container.nativeElement.appendChild(poster);

    fromEvent(video, 'playing').pipe(
      take(1),
      delay(100),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      poster.parentElement.removeChild(poster);
    });
  }

  createVideoFromBuffer(data) {
    const video = document.createElement('video');
    const poster = document.createElement('img');
    video.loop = true;
    video['playsinline'] = true;
    video.muted = true;
    video.style.setProperty('will-change', 'transform');

    poster.className = 'video-poster';
    poster.src = data.imageblur;

    const newImage = document.createElement('img');
    newImage.onload = () => {
      poster.src = data.image;
    }
    newImage.src = data.image;


    this.buffer.ready
      .then(() => {
        this.buffer.attachToVideo(video);
        log(this.buffer);
        debugger
        this.buffer.play();
        this.viewport.register(this.element.nativeElement, {}, NEVER, '', false).pipe(
          untilDestroyed(this)
        ).subscribe(({ type }) => {
          log('в вьюпорте?', type);
          if (type === 'leave') {
            video.pause();
          } else {
            video.play();
          }
        })
      });

    this.container.nativeElement.appendChild(video);
    this.container.nativeElement.appendChild(poster);

    fromEvent(video, 'playing').pipe(
      take(1),
      delay(100),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      poster.parentElement.removeChild(poster);
    });
  }
}
