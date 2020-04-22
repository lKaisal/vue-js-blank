export default function(
  /** Элемент с текстом внутри */
  el: HTMLElement,
  /** Контейнер. относительно коротого замеряется текст */
  container?: HTMLElement,
  /** Либо ширина контейнера, относительно которого замеряется текст */
  targetWidth?: number): boolean {

  const containerWidth = targetWidth || container.offsetWidth

  const clone = el.cloneNode(true) as HTMLElement
  clone.setAttribute('style', 'display: inline-block; opacity: 0; pointer-events: none;')
  document.body.appendChild(clone)
  const textWidth = parseFloat(getComputedStyle(clone).width)
  document.body.removeChild(clone)

  return textWidth > containerWidth
}
