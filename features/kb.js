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

export const name = 'kb';

export function whatColumn(nano) {
  let i;
  let node;
  for (i = 0, node = nano.cursor;
       node && node.nodeName !== 'BR';
       i++,node = node.previousSibling) {}
  return i;
}

export function nextLine(nano) {
  const column = whatColumn(nano);
  console.log(whatColumn(nano));
  while (nano.cursor.nextSibling &&
         nano.cursor.nextSibling.nodeName !== 'BR') {
    nano.forwardChar();
  }
  for (let i = 0; i < column; i++) {
    console.log(i);
    nano.forwardChar();
  }
}

export function previousLine(nano) {
}

const helpContent = 'hello world';

export function load(nano) {
  nano.message(name + ' loaded');
  nano.globalSetKey('Enter', () => {
    nano.newline();
  });
  nano.globalSetKey('Backspace', () => {
    nano.deleteChar();
  });
  nano.globalSetKey('Delete', () => {
    nano.forwardChar();
    nano.deleteChar();
  });
  nano.globalSetKey('ArrowRight', () => {
    nano.forwardChar();
  });
  nano.globalSetKey('ArrowLeft', () => {
    nano.backwardChar();
  });
  nano.globalSetKey('ArrowRight', () => {
    nano.forwardChar();
  });
  nano.globalSetKey('ArrowDown', () => {
    nextLine(nano);
  });
  nano.globalSetKey('ArrowUp', () => {
    previousLine(nano);
  });
  nano.globalSetKey('^g', () => {
    nano.visitBuffer(nano.createBuffer('help', helpContent, true));
  });
  nano.globalSetKey('M-<', () => {
    nano.previousBuffer();
  });
  nano.globalSetKey('M->', () => {
    nano.nextBuffer();
  });
  nano.globalSetKey('^l', () => {
    // nano.refreshScreen();
  });
  nano.globalSetKey('^w', () => {
    // nano.searchForward();
  });
  nano.globalSetKey('^x', () => {
    nano.exit();
  });
};

export function unload(nano) {
  nano.message(name + ' unloaded');
}
