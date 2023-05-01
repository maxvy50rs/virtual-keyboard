import './style.css';
import keyboard from './keyboard';

document.querySelector('#app').innerHTML = `
  <header id="header">
    <h1 class="heading">RSS Virtual Keyboard</h1>
  </header>
  <main id="main">
    <textarea id="test-area" name="test-area" rows="8" cols="70">try some buttons</textarea>
  </main>
  <footer id="footer">
    <p>
      Keyboard developed on Ubuntu OS
      <br>
      Press Left(Ctrl + Alt) to switch language to Russian
    </p>
  </footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  const testArea = document.getElementById('test-area');
  keyboard.bindTo(testArea);
  keyboard.init();
  alert('Привет! Я из-за работы не успел доделать некоторые моменты (описал в PR) -- буду признателен, если дашь мне еще немного времени и перепроверишь. Thanks!');
});
