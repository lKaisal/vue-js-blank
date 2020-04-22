import memo from 'memo-decorator';


class Helpers {
  @memo()
  static transitionEndEventName() {
    let i;
    const el = document.createElement('div');
    const transitions = {
      'transition':'transitionend',
      'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };

    for (i in transitions) {
      if (el.style[i] !== undefined) {
        return transitions[i];
      }
    }
  }

  @memo()
  static transitionCancelEventName() {
    let i;
    const el = document.createElement('div')
    const transitions = {
      'transition':'transitioncancel',
      'OTransition':'otransitioncancel',  // oTransitioncancel in very old Opera
      'MozTransition':'transitioncancel',
      'WebkitTransition':'webkitTransitionCancel'
    };

    for (i in transitions) {
      if (el.style[i] !== undefined) {
        return transitions[i];
      }
    }
  }
}

export const transitionEndEventName = Helpers.transitionEndEventName;
export const transitionCancelEventName = Helpers.transitionCancelEventName;
