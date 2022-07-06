import File from './File.js';

export default class Nano {
  #version;

  #fileNameElement;

  #textAreaElement;

  #openedFiles;

  #shownFile;

  constructor(fileNameElement, textAreaElement) {
    this.#version = '1.0.0';
    this.#fileNameElement = fileNameElement;
    this.#textAreaElement = textAreaElement;
    this.#openedFiles = {};
    this.visit('New file');
  }

  get version() {
    return this.#version;
  }

  get openedFiles() {
    return this.#openedFiles;
  }

  open(fileName) {
    if (this.#openedFiles[fileName] == null) {
      this.#openedFiles[fileName] = new File(fileName);
    }
  }

  show(fileName) {
    this.#shownFile = this.#openedFiles[fileName];
    this.#fileNameElement.innerText = fileName;
  }

  visit(fileName) {
    this.open(fileName);
    if (this.#openedFiles[fileName] != null) {
      this.show(fileName);
    }
  }

  write(text) {
    this.#textAreaElement.innerHTML += text;
  }
}
