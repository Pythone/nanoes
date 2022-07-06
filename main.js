import Nano from './modules/Nano.js';

const nano = new Nano(document.getElementById('file-name'), document.getElementById('text-area'));
nano.write('hello world<br>');
nano.write(`nano version: ${nano.version}`);
