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
    document.addEventListener('keyup', (e) => {
      this.state.pressed.delete(e.code);
    });

    this.createKeys();
    this.elements.self.append(...this.elements.keys);
  },

  bindTo(element) {
    this.targetElem = element;
  },

  createKeys() {
    /* this.elements.keys = this.props.layouts.en.alphanumeric.map((key) => {
      const elem = document.createElement('div');
      elem.classList.add('key');
      elem.innerHTML = key;
      return elem;
    }); */
  },

  triggerEvent() {

  },

  toggleCapsLock() {

  },
};

export default keyboard;
