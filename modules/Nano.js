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
    document.getElementById('version').appendChild(document.createTextNode(this.#version));
    this.#openedFiles = [];
    this.#fileName = document.getElementById(fileName);
    this.#editWindow = document.getElementById(editWindow);
    this.#editWindow.focus();
    this.#editWindow.addEventListener('keydown', (event) => this.#listen(event));
    this.#statusBar = document.getElementById(statusBar);
    this.#cursor = document.getElementById(cursor);
    this.#visit(new File('New file'));
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

  #open(file) {
    this.#openedFiles.push(file);
  }

  #show(file) {
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
        this.#insertNewLine();
        i += 1;
      } else {
        this.#insert(character1);
      }
    }
  }

  #visit(file) {
    this.#open(file);
    this.#show(file);
  }

  #delete() {
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

  #insertNewLine() {
    this.#editWindow.insertBefore(document.createElement('br'), this.#cursor);
  }

  #insert(character) {
    this.#editWindow.insertBefore(document.createTextNode(character), this.#cursor);
  }

  #showStatus(text, code) {
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

  #listen(event) {
    event.preventDefault();
    if (this.#statusBar.parentNode.style.visibility !== 'hidden') {
      this.#statusBar.parentNode.style.visibility = 'hidden';
    }
    const {
      key, ctrlKey, altKey, shiftKey,
    } = event;
    if (ctrlKey) {
      switch (key) {
        case 'g': {
          const file = new File('help');
          file.insert(`^key = ctrl + key\n
^g to get help\\n
^o to write out\\n
^w for where is\\n
^k to cut text\\n
^j to justify\\n
^c for current position\\n
^x to exit\\n
^r to read file\\n
^\\ to replace\\n
^u to paste text\\n
^t to spell\\n
^_ to go to line`);
          this.#visit(file);
          break;
        }
        default:
      }
    } else if (altKey) {
      switch (key) {
        case '<': {
          const file = this.#openedFiles[this.#openedFiles.indexOf(this.#shownFile) - 1];
          if (file) {
            this.#show(file);
          } else {
            this.#showStatus('no preceding file to be switched to', 1);
          }
          break;
        }
        case '>': {
          const file = this.#openedFiles[this.#openedFiles.indexOf(this.#shownFile) + 1];
          if (file) {
            this.#show(file);
          } else {
            this.#showStatus('no succeeding file to be switched to', 1);
          }
          break;
        }
        default:
      }
    } else {
      switch (key) {
        case 'Backspace':
          this.#delete();
          break;
        case 'Enter':
          this.#shownFile.insert('\n');
          this.#insertNewLine();
          break;
        default:
          if (key.length < 2) {
            this.#shownFile.insert(key);
            this.#insert(key);
          }
      }
    }
  }
}
