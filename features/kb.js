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
  const column = nano.moveBeginningOfLine();
  let i;
  for (i = 0; i < column; i++) {
    nano.forwardChar();
  }
  return column;
}

export function nextLine(nano) {
  const column = whatColumn(nano);
  nano.moveEndOfLine();
  for (let i = 0; i < column; i++) {
    nano.forwardChar();
  }
}

export function previousLine(nano) {
  const column = whatColumn(nano);
  nano.moveBeginningOfLine();
  nano.moveBeginningOfLine();
  for (let i = 0; i < column; i++) {
    nano.forwardChar();
  }
}

export function backwardWord(nano) {
  const word = [];
  while (nano.cursor.previousSibling &&
         nano.cursor.previousSibling.nodeValue !== ' ') {
    word.push(nano.cursor.previousSibling.nodeValue);
    nano.backwardChar();
  }
  return word.reverse().join('');
}

export const helpContent = 'hello world';

export function load(nano) {
  nano.message(name + ' loaded');
  nano.registerExtendedCommand(name, 'backwardWord', backwardWord);
  nano.registerExtendedCommand(name, 'whatColumn', whatColumn);
  nano.registerExtendedCommand(name, 'nextLine', nextLine);
  nano.registerExtendedCommand(name, 'previousLine', previousLine(nano));
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
  nano.globalSetKey('^ArrowLeft', () => {
    backwardWord(nano);
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
  nano.globalSetKey('^E', () => {
    nano.executeExtendedCommand(name, backwardWord(nano));
  });
};

export function unload(nano) {
  nano.message(name + ' unloaded');
}
