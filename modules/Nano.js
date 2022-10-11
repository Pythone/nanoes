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

  #keybindings;

  #features;

  constructor(fileName, editWindow, statusBar, cursor) {
    this.#version = '1.0.0';
    document.getElementById('version').appendChild(document.createTextNode(this.#version));
    this.#openedFiles = [];
    this.#shownFile = null;
    this.#fileName = document.getElementById(fileName);
    this.#editWindow = document.getElementById(editWindow);
    this.#editWindow.focus();
    this.#editWindow.addEventListener('keydown', (event) => this.listen(event));
    this.#statusBar = document.getElementById(statusBar);
    this.#cursor = document.getElementById(cursor);
    this.visitFile(this.newFile('new file'));
    this.#keybindings = {};
    this.#features = [];
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

  get fileName() {
    return this.#fileName;
  }

  get editWindow() {
    return this.#editWindow;
  }

  get statusBar() {
    return this.#statusBar;
  }

  get cursor() {
    return this.#cursor;
  }

  get keybindings() {
    return this.#keybindings;
  }

  get features() {
    return this.#features;
  }

  newFile(name, content = '', readOnly = false) {
    return new File(name, content, readOnly);
  }

  openFile(file) {
    this.openedFiles.push(file);
  }

  showFile(file) {
    for (let i = 0; i < this.openedFiles.length; i += 1) {
      if (this.openedFiles[i] === file) {
        this.#shownFile = file;
        break;
      }
    }
    while (this.fileName.firstChild) {
      this.fileName.removeChild(this.fileName.firstChild);
    }
    this.fileName.appendChild(document.createTextNode(file.name));
    this.clear(this.editWindow);
    this.editWindow.appendChild(this.cursor);
    for (let i = 0; i < this.shownFile.content.length; i += 1) {
      const character1 = this.shownFile.content.charAt(i);
      const character2 = this.shownFile.content.charAt(i + 1);
      if (character1 === '\\' && character2 === 'n') {
        this.newline();
        i += 1;
      } else {
        this.insertChar(character1);
      }
    }
  }

  visitFile(file) {
    this.openFile(file);
    this.showFile(file);
  }

  previousFile() {
    const file = this.openedFiles[this.openedFiles.indexOf(this.shownFile) - 1];
    if (file) {
      this.showFile(file);
    } else {
      this.message('no preceding file to be switched to');
    }
  }

  nextFile() {
    const file = this.openedFiles[this.openedFiles.indexOf(this.shownFile) + 1];
    if (file) {
      this.showFile(file);
    } else {
      this.error('no succeeding file to be switched to');
    }
  }

  deleteBackwardChar() {
    const node = this.#cursor.previousSibling;
    if (node) {
      this.#editWindow.removeChild(node);
    }
  }

  clear(node) {
    if (!node) {
      return;
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  newline() {
    this.#editWindow.insertBefore(document.createElement('br'), this.#cursor);
  }

  insertChar(character) {
    this.#editWindow.insertBefore(document.createTextNode(character), this.#cursor);
  }

  showStatus(string, code) {
    this.clear(this.#statusBar);
    this.#statusBar.appendChild(document.createTextNode(string));
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

  message(string) {
    this.showStatus(string, 0);
  }

  error(string) {
    this.showStatus(string, 1);
  }

  listen(event) {
    let binding = '';
    event.preventDefault();
    if (this.#statusBar.parentNode.style.visibility !== 'hidden') {
      this.#statusBar.parentNode.style.visibility = 'hidden';
    }
    const {
      key, ctrlKey, altKey
    } = event;
    if (ctrlKey) {
      binding += 'Control ';
    }
    if (altKey) {
      binding += 'Alt ';
    }
    if (key.length < 2 && binding.length < 1) {
      if (this.shownFile.insertChar(key)) {
        this.insertChar(key);
      } else {
        this.message('file is read-only', 1);
      }
    }
    binding += key;
    if (binding in this.keybindings) {
      this.keybindings[binding].call(this);
    }
  }

  globalSetKey(key, value) {
    this.keybindings[key] = value;
  }
  
  async load(feature) {
    const module = await import('../features/' + feature + '.js');
    module.load(this);
    this.features[module.name] = module;
  }

  unload(feature) {
    feature.unload(this);
    delete this.features[feature];
  }

  exit () {
    for (const key in this.features) {
      this.unload(this.features[key]);
    }
  }
}
