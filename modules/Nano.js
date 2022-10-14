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

import Buffer from './Buffer.js';

export default class Nano {
  #titleBar;
  
  #name;

  #version;

  #title;
  
  #bufferName;

  #editWindow;

  #cursor;

  #statusBar;

  #status;

  #prompt;

  #input;

  #helpLines;

  #openedBuffers;

  #shownBuffer;

  #keybindings;

  #features;

  #commands;

  #promise;
  
  constructor(titleBar, title, bufferName, editWindow, cursor, statusBar, helpLines) {
    this.#titleBar = document.getElementById(titleBar);
    this.#name = 'nano';
    this.#version = '1.0.0';
    this.#title = document.getElementById('title');
    this.title.appendChild(document.createTextNode(this.name + ' ' + this.version));
    this.#openedBuffers = [];
    this.#bufferName = document.getElementById(bufferName);
    this.#editWindow = document.getElementById(editWindow);
    this.editWindow.addEventListener('keydown', (event) => this.listenEditWindow(event));
    this.editWindow.tabIndex = 0;
    this.editWindow.focus();
    this.#cursor = document.getElementById(cursor);
    this.#statusBar = document.getElementById(statusBar);
    this.statusBar.tabIndex = 0;
    this.statusBar.addEventListener('keydown', (event) => this.listenStatusBar(event));
    this.#status = document.createElement('div');
    this.statusBar.appendChild(this.status);
    this.#prompt = document.createTextNode('');
    this.statusBar.appendChild(this.prompt);
    this.#input = document.createElement('pre');
    this.statusBar.appendChild(this.input);
    this.#helpLines = helpLines;
    this.visitBuffer(this.createBuffer('new buffer'));
    this.#keybindings = {};
    this.#features = [];
    this.#commands = {};
    this.#promise;
  }

  get titleBar() {
    return this.#titleBar;
  }

  get name() {
    return this.#name;
  }

  get version() {
    return this.#version;
  }

  get title() {
    return this.#title;
  }
  
  get bufferName() {
    return this.#bufferName;
  }

  get editWindow() {
    return this.#editWindow;
  }

  get cursor() {
    return this.#cursor;
  }

  get statusBar() {
    return this.#statusBar;
  }

  get status() {
    return this.#status;
  }

  get prompt() {
    return this.#prompt;
  }

  get input() {
    return this.#input;
  }

  get helpLines() {
    return this.#helpLines;
  }

  get openedBuffers() {
    return this.#openedBuffers;
  }

  get shownBuffer() {
    return this.#shownBuffer;
  }

  get keybindings() {
    return this.#keybindings;
  }

  get features() {
    return this.#features;
  }

  get commands() {
    return this.#commands;
  }

  createBuffer(name, content = '', readOnly = false) {
    return new Buffer(name, content, readOnly);
  }

  openBuffer(buffer) {
    this.openedBuffers.push(buffer);
  }

  showBuffer(buffer) {
    for (let i = 0; i < this.openedBuffers.length; i += 1) {
      if (this.openedBuffers[i] === buffer) {
        this.#shownBuffer = buffer;
        break;
      }
    }
    while (this.bufferName.firstChild) {
      this.bufferName.removeChild(this.bufferName.firstChild);
    }
    this.bufferName.appendChild(document.createTextNode(buffer.name));
    this.clearNode(this.editWindow);
    this.editWindow.appendChild(this.cursor);
    for (let i = 0; i < this.shownBuffer.content.length; i += 1) {
      const character1 = this.shownBuffer.content.charAt(i);
      const character2 = this.shownBuffer.content.charAt(i + 1);
      if (character1 === '\\' && character2 === 'n') {
        this.newline();
        i += 1;
      } else {
        this.insertChar(character1);
      }
    }
  }

  visitBuffer(buffer) {
    this.openBuffer(buffer);
    this.showBuffer(buffer);
  }

  previousBuffer() {
    const buffer = this.openedBuffers[this.openedBuffers.indexOf(this.shownBuffer) - 1];
    if (buffer) {
      this.showBuffer(buffer);
    } else {
      this.error('no preceding buffer to be switched to');
    }
  }

  nextBuffer() {
    const buffer = this.openedBuffers[this.openedBuffers.indexOf(this.shownBuffer) + 1];
    if (buffer) {
      this.showBuffer(buffer);
    } else {
      this.error('no succeeding buffer to be switched to');
    }
  }

  clearNode(node) {
    if (!node) {
      return;
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  newline() {
    this.editWindow.insertBefore(document.createElement('br'), this.cursor);
  }

  insertChar(character) {
    this.editWindow.insertBefore(document.createTextNode(character), this.cursor);
  }

  deleteChar() {
    const node = this.cursor.previousSibling;
    if (node) {
      this.editWindow.removeChild(node);
    }
  }

  forwardChar() {
    if (this.cursor.nextSibling) {
      this.editWindow.insertBefore(this.cursor.nextSibling, this.cursor);
    }
  }

  backwardChar() {
    if (this.cursor.previousSibling) {
      this.editWindow.insertBefore(this.cursor, this.cursor.previousSibling);
    }
  }

  moveBeginningOfLine() {
    let counter = 0;
    while (this.cursor.previousSibling &&
           this.cursor.previousSibling.nodeName !== 'BR') {
      this.backwardChar();
      counter++;
    }
    return counter;
  }

  moveEndOfLine() {
    let counter = 0;
    while (this.cursor.nextSibling &&
           this.cursor.nextSibling.nodeName !== 'BR') {
      this.forwardChar();
      counter++;
    }
    return counter;
  }
  
  showStatus(string, code) {
    this.clearNode(this.status);
    this.status.appendChild(document.createTextNode(string));
    switch (code) {
    case 0:
      this.statusBar.style.backgroundColor = '#fff';
      this.statusBar.style.color = '#000';
      break;
    case 1:
      this.statusBar.style.backgroundColor = '#c00';
      this.statusBar.style.color = '#fff';
      break;
    default:
    }
    this.statusBar.style.visibility = 'visible';
  }j

  message(string) {
    console.log(string);
    this.showStatus(string, 0);
  }

  error(string) {
    this.showStatus(string, 1);
  }

  listenEditWindow(event) {
    let keybinding = '';
    event.preventDefault();
    this.statusBar.style.visibility = 'hidden';
    this.status.textContent = '';
    const {
      key, ctrlKey, altKey
    } = event;
    if (ctrlKey) {
      keybinding += '^';
    }
    if (altKey) {
      keybinding += 'M-';
    }
    if (key.length < 2 && keybinding.length < 1) {
      if (this.shownBuffer.insertChar(key)) {
        this.insertChar(key);
      } else {
        this.message('buffer is read-only', 1);
      }
    }
    keybinding += key;
    if (keybinding in this.keybindings['editWindow']) {
      this.keybindings['editWindow'][keybinding]();
    }
  }

  listenStatusBar(event) {
    let keybinding = '';
    event.preventDefault();
    const {
      key, ctrlKey, altKey
    } = event;
    if (ctrlKey) {
      keybinding += '^';
    }
    if (altKey) {
      keybinding += 'M-';
    }
    if (key.length < 2 && keybinding.length < 1) {
      this.input.appendChild(document.createTextNode(key));
    }
    keybinding += key;
    if (keybinding in this.keybindings['statusBar']) {
      this.keybindings['statusBar'][keybinding]();
    }
  }

  globalSetKey(key, value, mode = 'editWindow') {
    if (!this.keybindings[mode]) {
      this.keybindings[mode] = {};
    }
    this.keybindings[mode][key] = value;
  }
  
  async load(feature) {
    const module = await import('../features/' + feature + '.js');
    module.load(this);
    this.features[module.name] = module;
  }

  unload(feature) {
    feature.unload(this);
    delete this.features[feature.name];
    this.unregisterExtendedCommand(feature.name);
  }

  exit() {
    this.editWindow.blur();
    for (const key in this.features) {
      this.unload(this.features[key]);
    }
  }

  registerExtendedCommand(featureName, command) {
    if (!this.commands[featureName]) {
      this.commands[featureName] = {};
    }
    this.commands[featureName][command.name] = command.bind(this);
  }
  unregisterExtendedCommand(featureName, commandName = null) {
    if (commandName) {
      delete this.commands[featureName][commandName];
    } else {
      delete this.commands[featureName]; 
    }
  }

  executeExtendedCommand(command) {
    const args = command.split(' ');
    console.log(args);
    for (const feature in this.commands) {
      if (this.commands[feature][args[0]]) {
      let value;
      if (feature === this.name) {
        value = this.commands[feature][args[0]](... args.slice(1, args.length));
      } else {
        value = this.commands[feature][args[0]](... [this].concat(args.slice(1, args.length)));
      }
      console.log(value);
      if (value != undefined) {
        this.message(value);
      }
      break;
    }
    }
  }

  readString(prompt) {
    this.statusBar.style.visibility = 'visible';
    this.prompt.textContent = prompt;
    this.statusBar.focus();
  }
}
