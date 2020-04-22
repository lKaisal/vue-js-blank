import VisibilityObserver from '@/mixins/VisibilityObserver'

function animateIfVisible(
  reverse: boolean = false,
  className: string = 'js-voa-start',
) {
  const options = {
    targets: document.getElementsByClassName(className),
    offset: 100,
    ifIntoView() {
      if (!reverse) this.classList.remove(className)
      else this.classList.add(className)
    }
  }

  return new VisibilityObserver(options)
}

export { animateIfVisible }
export default animateIfVisible
