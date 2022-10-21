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

export default class Buffer {
  #name;

  #readOnly;

  #node;

  #cursor;

  constructor(name, readOnly = false) {
    this.#name = name;
    this.#readOnly = readOnly;
    this.#node = document.createElement('pre');
    this.hide();
    this.#cursor = document.createElement('span');
    this.cursor.appendChild(document.createTextNode('|'));
    this.cursor.classList = 'animate-pulse bg-white';
    this.node.appendChild(this.cursor);
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get readOnly() {
    return this.#readOnly;
  }

  set readOnly(value) {
    this.#readOnly = value;
  }

  get node() {
    return this.#node;
  }

  get cursor() {
    return this.#cursor;
  }

  show() {
    this.node.style.display = 'block';
    this.node.dispatchEvent(new CustomEvent('visibilityChange', { visible: true}));
  }

  hide() {
    this.node.style.display = 'none';
    this.node.dispatchEvent(new CustomEvent('visibilityChange', { visible: false }));
  }

  insertChar(character) {
    let status = false;
    if (!this.readOnly) {
      this.node.insertBefore(character === '\n'
                             ? document.createElement('br')
                             : document.createTextNode(character), this.cursor);
      status = true;
    }
    this.node.dispatchEvent(new CustomEvent('insertChar', { status: status }));
  }

  deleteChar() {
    const node = this.cursor.previousSibling;
    if (node) {
      this.node.removeChild(node);
    }
  }
}
