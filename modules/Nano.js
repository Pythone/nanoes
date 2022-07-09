import File from './File.js';

export default class Nano {
  #version;

  #openedFiles;

  #shownFile;

  #fileName;

  #textArea;

  #cursor;

  constructor(fileName, textArea, cursor) {
    this.#version = '1.0.0';
    document.getElementById('version').appendChild(document.createTextNode(this.#version));
    this.#openedFiles = {};
    this.#fileName = document.getElementById(fileName);
    this.#textArea = document.getElementById(textArea);
    this.#cursor = document.getElementById(cursor);
    this.#visit('new file');
    document.addEventListener('keydown', (event) => this.#listen(event));
  }

  get version() {
    return this.#version;
  }

  get openedFiles() {
    return this.#openedFiles;
  }

  get shownFile() {
    return this.#shownFile;
  }

  #open(fileName) {
    if (this.#openedFiles[fileName] == null) {
      this.#openedFiles[fileName] = new File(fileName);
    }
  }

  #show(fileName) {
    this.#shownFile = this.#openedFiles[fileName];
    this.#fileName.innerText = fileName;
  }

  #visit(fileName) {
    this.#open(fileName);
    if (this.#openedFiles[fileName]) {
      this.#show(fileName);
    }
  }

  #delete(node) {
    if (node) {
      this.#textArea.removeChild(node);
    }
  }

  #insert(character) {
    const child = document.createElement('span');
    child.appendChild(document.createTextNode(character));
    this.#textArea.insertBefore(child, this.#cursor);
  }

  #listen(event) {
    const { key } = event;
    switch (key) {
      case 'Backspace':
      case 'Delete':
        this.#delete(this.#cursor.previousSibling);
        break;
      case 'Control':
        break;
      case 'Alt':
        break;
      case 'Shift':
        break;
      default:
        this.#insert(event.key);
    }
  }
}
