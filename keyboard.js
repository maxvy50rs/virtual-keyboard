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
    this.elements.self = document.createElement('div');
    this.elements.self.setAttribute('id', 'keyboard');
    document.getElementById('main').append(this.elements.self);

    this.state.currentLayout = localStorage.layout ?? 'en';
    document.addEventListener('keydown', (e) => {
      this.state.pressed.add(e.code);
      if (this.state.pressed.has('ShiftLeft') && this.state.pressed.has('AltLeft')) {
        localStorage.layout = localStorage.layout === 'en' ? 'ru' : 'en';
      }
    });
    document.addEventListener('keydown', (e) => {
      const alphanumeric = this.props.layouts[this.state.currentLayout];
      if (alphanumeric.has(e.code)) {
        const keyButton = document.getElementById(e.code);
        keyButton.click();
        keyButton.classList.add('key--pressed');
      }
    });
    document.addEventListener('keyup', (e) => {
      this.state.pressed.delete(e.code);
      const keyButton = document.getElementById(e.code);
      keyButton.classList.remove('key--pressed');
    });

    this.createKeys();
    this.elements.self.append(...this.elements.keys);
  },

  createKeys() {
    const layout = this.props.layouts[this.state.currentLayout];
    let tabIndex = 1;
    layout.forEach((char, code) => {
      const elem = document.createElement('div');
      elem.classList.add('key');
      elem.setAttribute('id', code);
      elem.setAttribute('tabindex', tabIndex);
      tabIndex += 1;
      elem.innerHTML = char;
      elem.addEventListener('click', () => {
        this.props.targetElem.value += char;
      });
      this.elements.keys.push(elem);
    });
  },

  bindTo(element) {
    this.props.targetElem = element;
  },

  triggerEvent() {

  },

  toggleCapsLock() {

  },
};

export default keyboard;
