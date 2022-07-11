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

  #textArea;

  #cursor;

  constructor(fileName, textArea, cursor) {
    this.#version = '1.0.0';
    document.getElementById('version').appendChild(document.createTextNode(this.#version));
    this.#openedFiles = [];
    this.#fileName = document.getElementById(fileName);
    this.#textArea = document.getElementById(textArea);
    this.#cursor = document.getElementById(cursor);
    this.#visit(new File('new file'));
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
    this.#clear();
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
      this.#textArea.removeChild(node);
    }
  }

  #clear() {
    while (this.#textArea.firstChild) {
      this.#textArea.removeChild(this.#textArea.firstChild);
    }
    this.#textArea.appendChild(this.#cursor);
  }

  #insertNewLine() {
    this.#textArea.insertBefore(document.createElement('br'), this.#cursor);
  }

  #insert(character) {
    this.#textArea.insertBefore(document.createTextNode(character), this.#cursor);
  }

  #listen(event) {
    event.preventDefault();
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
          }
          break;
        }
        case '>': {
          const file = this.#openedFiles[this.#openedFiles.indexOf(this.#shownFile) + 1];
          if (file) {
            this.#show(file);
          }
          break;
        }
        default:
      }
    } else {
      switch (key) {
        case 'Backspace':
        case 'Delete':
          this.#delete();
          break;
        case 'Enter':
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
