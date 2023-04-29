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
      Press Left(Shift + Alt) to switch language to [alt-lang]
    </p>
  </footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  const testArea = document.getElementById('test-area');
  keyboard.bindTo(testArea);
  keyboard.init();
});
