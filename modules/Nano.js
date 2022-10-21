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

  #statusBar;

  #status;

  #prompt;

  #input;

  #helpLines;

  #openedBuffers;

  #currentBuffer;

  #keybindings;

  #features;

  #commands;

  #promise;
  
  constructor(titleBar, title, bufferName, editWindow, statusBar, helpLines) {
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
    this.visitBuffer(this.createBuffer('New buffer'));
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

  get currentBuffer() {
    return this.#currentBuffer;
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

  createBuffer(name, readOnly) {
    const buffer = new Buffer(name, readOnly);
    buffer.node.addEventListener('insertChar', event => {
      if (!event.status) {
        
      }
    });
    this.editWindow.appendChild(buffer.node);
    this.openedBuffers.push(buffer);
    return buffer;
  }

  visitBuffer(buffer) {
    if (this.currentBuffer) {
      this.currentBuffer.hide(); 
    }
    this.#currentBuffer = buffer;
    this.currentBuffer.show();
    this.clearNode(this.bufferName);
    this.bufferName.appendChild(document.createTextNode(buffer.name));
  }

  previousBuffer() {
    const buffer = this.openedBuffers[this.openedBuffers.indexOf(this.currentBuffer) - 1];
    if (buffer) {
      this.visitBuffer(buffer);
    } else {
      this.error('no preceding buffer to be switched to');
    }
  }

  nextBuffer() {
    const buffer = this.openedBuffers[this.openedBuffers.indexOf(this.currentBuffer) + 1];
    if (buffer) {
      this.visitBuffer(buffer);
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
    this.currentBuffer.insertChar('\n');
  }

  insertChar(character) {
    this.currentBuffer.insertChar(character);
  }

  deleteChar() {
    this.currentBuffer.deleteChar();
  }

  forwardChar() {
    if (this.currentBuffer.cursor.nextSibling) {
      this.currentBuffer.node.insertBefore(this.currentBuffer.cursor.nextSibling, this.currentBuffer.cursor);
    }
  }

  backwardChar() {
    if (this.currentBuffer.cursor.previousSibling) {
      this.currentBuffer.node.insertBefore(this.currentBuffer.cursor, this.currentBuffer.cursor.previousSibling);
    }
  }

  searchForward(character = null) {
    const node = this.currentBuffer.cursor;
    while (node.nextSibling) {
      node = node.nextSibling;
      if (node.nodeValue === character) {
        return node;
      }
    }
    return null;
  }

  moveBeginningOfLine() {
    let counter = 0;
    while (this.currentBuffer.cursor.previousSibling &&
           this.currentBuffer.cursor.previousSibling.nodeName !== 'BR') {
      this.backwardChar();
      counter++;
    }
    return counter;
  }

  moveEndOfLine() {
    let counter = 0;
    while (this.currentBuffer.cursor.nextSibling &&
           this.currentBuffer.cursor.nextSibling.nodeName !== 'BR') {
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
      this.insertChar(key);
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
