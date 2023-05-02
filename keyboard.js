import layouts from './layouts';

const keyboard = {
  elements: {
    self: null,
    keys: [],
  },

  props: {
    layouts,
    targetElem: null,
  },

  state: {
    currentLayout: 'en',
    isCapsLocked: false,
    pressed: new Set(),
  },

  init() {
    this.state.currentLayout = localStorage.layout ?? 'en';
    this.elements.self = document.createElement('div');
    this.elements.self.setAttribute('id', 'keyboard');
    document.getElementById('main').append(this.elements.self);

    const mindPressed = (e) => {
      this.state.pressed.add(e.code);
    };
    const forgetPressed = (e) => {
      if (e.code === 'CapsLock') return;
      this.state.pressed.delete(e.code);
    };
    const handleShift = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.showChars(this.visibleCharsSelector());
      }
    };
    const handleLangSwitch = () => {
      if (this.state.pressed.has('ControlLeft') && this.state.pressed.has('AltLeft')) {
        localStorage.layout = localStorage.layout === 'en' ? 'ru' : 'en';
        this.state.currentLayout = localStorage.layout;
        this.showChars(this.visibleCharsSelector());
      }
    };
    const handleCaps = (e) => {
      if (e.code !== 'CapsLock') return;
      this.state.isCapsLocked = !this.state.isCapsLocked;
      document.getElementById(e.code).classList.toggle('key--pressed');
      if (this.state.pressed.has('CapsLock')) {
        this.state.pressed.delete(e.code);
      }
      this.showChars(this.visibleCharsSelector());
    };
    const handleRemove = (e) => {
      if (!(e.code === 'Backspace') && !(e.code === 'Delete')) return;
      e.preventDefault();
      const temp = [...this.props.targetElem.value];
      const startPos = this.props.targetElem.selectionStart + (e.code === 'Delete' ? 0 : -1);
      temp[startPos] = '';
      this.props.targetElem.value = temp.join('');
      this.props.targetElem.selectionStart = Math.max(0, startPos);
      this.props.targetElem.selectionEnd = Math.max(0, startPos);
    };

    document.addEventListener('keydown', mindPressed);
    document.addEventListener('keydown', handleShift);
    document.addEventListener('keyup', forgetPressed);
    document.addEventListener('keyup', handleShift);
    document.addEventListener('keydown', handleLangSwitch);
    document.addEventListener('keydown', handleCaps);
    document.addEventListener('keypress', handleRemove);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'CapsLock') return;
      const chars = this.props.layouts[this.state.currentLayout];
      const keyButton = document.getElementById(e.code);
      keyButton.classList.add('key--pressed');
      if (chars.has(e.code)) {
        e.preventDefault();
        keyButton.click();
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'CapsLock') return;
      const keyButton = document.getElementById(e.code);
      keyButton.classList.remove('key--pressed');
    });

    this.createKeys();
    this.createSysKeys();
    this.elements.keys.sort((a, b) => a.tabIndex - b.tabIndex);
    this.elements.keys.forEach((keyElem) => {
      this.elements.self.append(keyElem);
      if (keyElem.dataset.breakRow) {
        const rowBreaker = document.createElement('div');
        rowBreaker.classList.add('row-breaker');
        this.elements.self.append(rowBreaker);
      }
    });
    this.showChars(this.visibleCharsSelector());
  },

  createKeys() {
    const codesMap = layouts.en;
    const sysTabIndexes = [...layouts.sys.values()].map((sysKey) => sysKey.pos);
    let tabIndex = 1;
    codesMap.forEach(({ breakRow }, code) => {
      while (sysTabIndexes.indexOf(tabIndex) !== -1) {
        tabIndex += 1;
      }
      const newKey = document.createElement('div');
      newKey.classList.add('key');
      newKey.setAttribute('id', code);
      newKey.setAttribute('tabindex', tabIndex);
      newKey.innerHTML = `
        <span class="char char--en char--lower">${layouts.en.get(code).lower}</span>
        <span class="char char--en char--upper">${layouts.en.get(code).upper}</span>
        <span class="char char--ru char--lower">${layouts.ru.get(code).lower}</span>
        <span class="char char--ru char--upper">${layouts.ru.get(code).upper}</span>
      `;
      if (code === 'Enter') {
        newKey.innerHTML = 'Enter';
        newKey.classList.add('key--wide');
      }
      if (code === 'Space') {
        newKey.classList.add('key--space');
      }
      if (code === 'Tab') {
        newKey.innerHTML = 'Tab';
        newKey.classList.add('key--wide');
      }
      if (breakRow) {
        newKey.dataset.breakRow = true;
      }
      newKey.addEventListener('click', () => {
        const char = layouts[this.state.currentLayout].get(code);
        this.props.targetElem.value += this.isUpper() ? char.upper : char.lower;
      });

      tabIndex += 1;
      this.elements.keys.push(newKey);
    });
  },

  createSysKeys() {
    const codesMap = layouts.sys;
    codesMap.forEach(({ pos, label, breakRow }, code) => {
      const newKey = document.createElement('div');
      newKey.classList.add('key');
      newKey.classList.add('key--wide');
      newKey.setAttribute('id', code);
      newKey.setAttribute('tabindex', pos);
      newKey.innerHTML = label;
      if (breakRow) {
        newKey.dataset.breakRow = true;
      }
      if (code === 'Backspace' || code === 'Delete' || code === 'CapsLock') {
        newKey.addEventListener('click', () => {
          const eventType = code === 'CapsLock' ? 'keydown' : 'keypress';
          const keypressEvent = new KeyboardEvent(eventType, { code });
          document.dispatchEvent(keypressEvent);
        });
      }
      this.elements.keys.push(newKey);
    });
  },

  bindTo(element) {
    this.props.targetElem = element;
    element.focus();
    element.addEventListener('blur', () => { element.focus(); });
  },

  isUpper() {
    const isShiftPressed = this.state.pressed.has('ShiftLeft') || this.state.pressed.has('ShiftRight');
    return (this.state.isCapsLocked && !isShiftPressed)
      || (!this.state.isCapsLocked && isShiftPressed);
  },

  showChars(selector) {
    document
      .querySelectorAll('.char--visible')
      .forEach((elem) => { elem.classList.remove('char--visible'); });
    document
      .querySelectorAll(selector)
      .forEach((elem) => { elem.classList.add('char--visible'); });
  },

  visibleCharsSelector() {
    if (this.isUpper() && this.state.currentLayout === 'en') return '.char--en.char--upper';
    if (this.isUpper() && this.state.currentLayout === 'ru') return '.char--ru.char--upper';
    if (!this.isUpper() && this.state.currentLayout === 'ru') return '.char--ru.char--lower';
    return '.char--en.char--lower';
  },

};

export default keyboard;
