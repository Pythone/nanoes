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
export default class File {
  #name;

  #content;

  #readOnly;

  constructor(name, content, readOnly) {
    this.#name = name;
    this.#content = content;
    this.#readOnly = readOnly;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get content() {
    return this.#content;
  }

  get readOnly() {
    return this.#readOnly;
  }

  set readOnly(value) {
    this.#readOnly = value;
  }

  insertChar(character) {
    if (this.#readOnly) {
      return false;
    }
    this.#content += character;
    return true;
  }
}
