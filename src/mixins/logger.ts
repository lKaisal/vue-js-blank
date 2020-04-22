export function consoleChalk(name: string, color = 'ff4081') {
  return [
    `%c${name}`,
    `background: #${color}; color: white; padding: 2px 5px; border-radius: 3px`
  ];
}

function hashCode(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
     // tslint:disable-next-line:no-bitwise
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i){
  // tslint:disable-next-line:no-bitwise
  const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

export class Logger {
  /** Создает логгер, который автоматически присваивает цвет бейджику */
  static create(
    /** Название бейджика */
    name,
    /** Активен ли логгер,
     * null - только в дев режиме
     * false - никогда
     * true - всегда
     * */
    isEnabled: boolean = null) {
    return (...args) => {
      // Если включена форсом, то отображать логи, если не передан форс, то не показываем
      // if (isEnabled === true || isEnabled === null && !process.env.NODE_ENV === 'production') {
        console.log(...consoleChalk(name, intToRGB(hashCode(name))), ...args);
      // }
    }
  }

  /** Метод для логирования ворнингов не в продакшене */
  static warn(...args) {
    // if (!environment.production) {
      // console.log(!environment.production);
    // }
  }
}
