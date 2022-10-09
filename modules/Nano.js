/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import File from './File.js';

export default class Nano {
  #version;

  #openedFiles;

  #shownFile;

  #fileName;

  #editWindow;

  #statusBar;

  #cursor;

  constructor(fileName, editWindow, statusBar, cursor) {
    this.#version = '1.0.0';
    this.#shownFile = null;
    document.getElementById('version').appendChild(document.createTextNode(this.#version));
    this.#openedFiles = [];
    this.#fileName = document.getElementById(fileName);
    this.#editWindow = document.getElementById(editWindow);
    this.#editWindow.focus();
    this.#editWindow.addEventListener('keydown', (event) => this.listen(event));
    this.#statusBar = document.getElementById(statusBar);
    this.#cursor = document.getElementById(cursor);
    this.visit(new File('New file'));
    this.bindings = {};
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

  createFile(name) {
    return new File(name);
  }

  open(file) {
    this.#openedFiles.push(file);
  }

  show(file) {
    for (let i = 0; i < this.#openedFiles.length; i += 1) {
      if (this.#openedFiles[i] === file) {
        this.#shownFile = file;
        break;
      }
    }
    while (this.#fileName.firstChild) {
      this.#fileName.removeChild(this.#fileName.firstChild);
    }
    this.#fileName.appendChild(document.createTextNode(file.name));
    Nano.#clear(this.#editWindow);
    this.#editWindow.appendChild(this.#cursor);
    for (let i = 0; i < this.#shownFile.content.length; i += 1) {
      const character1 = this.#shownFile.content.charAt(i);
      const character2 = this.#shownFile.content.charAt(i + 1);
      if (character1 === '\\' && character2 === 'n') {
        this.insertNewLine();
        i += 1;
      } else {
        this.insert(character1);
      }
    }
  }

  visit(file) {
    this.open(file);
    this.show(file);
  }

  delete() {
    const node = this.#cursor.previousSibling;
    if (node) {
      this.#editWindow.removeChild(node);
    }
  }

  static #clear(node) {
    if (!node) {
      return;
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  insertNewLine() {
    this.#editWindow.insertBefore(document.createElement('br'), this.#cursor);
  }

  insert(character) {
    this.#editWindow.insertBefore(document.createTextNode(character), this.#cursor);
  }

  showStatus(text, code) {
    Nano.#clear(this.#statusBar);
    this.#statusBar.appendChild(document.createTextNode(text));
    switch (code) {
    case 0:
      this.#statusBar.parentNode.style.backgroundColor = '#fff';
      this.#statusBar.parentNode.style.color = '#000';
      break;
    case 1:
      this.#statusBar.parentNode.style.backgroundColor = '#c00';
      this.#statusBar.parentNode.style.color = '#fff';
      break;
    default:
    }
    if (this.#statusBar.parentNode.style.visibility === 'hidden') {
      this.#statusBar.parentNode.style.visibility = 'visible';
    }
  }

  listen(event) {
    let binding = '';
    event.preventDefault();
    if (this.#statusBar.parentNode.style.visibility !== 'hidden') {
      this.#statusBar.parentNode.style.visibility = 'hidden';
    }
    const {
      key, ctrlKey, altKey, shiftKey,
    } = event;
    if (ctrlKey) {
      binding += 'C ';
    }
    if (altKey) {
      binding += 'M ';
    }
    if (key.length < 2 && binding.length < 1) {
      if (this.shownFile.insert(key)) {
        this.insert(key);
      } else {
        this.showStatus('file is read-only', 1);
      }
    }
    binding += key;
    if (binding in this.bindings) {
      this.bindings[binding].call(this);
    }
  }

  setBinding(key, value) {
    this.bindings[key] = value;
  }
  
  async load(feature) {
    const module = await import(feature);
    module.load.call(this);
    console.log(module.name + ' loaded');
  }

  afterLoad() {
    this.showStatus("Welcome to nanoes. For basic help, type Ctrl+G.");
  }
}
