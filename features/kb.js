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

export function load() {
  this.setBinding("C g", function()  {
    const file = this.createFile('help');
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
    file.isReadOnly = true;
    this.visit(file);
  });
  this.setBinding("M <", function() {
    const file = this.openedFiles[this.openedFiles.indexOf(this.shownFile) - 1];
          if (file) {
            this.show(file);
          } else {
            this.showStatus('no preceding file to be switched to', 1);
          }
  });
  this.setBinding("M >", function() {
    const file = this.openedFiles[this.openedFiles.indexOf(this.shownFile) + 1];
          if (file) {
            this.show(file);
          } else {
            this.showStatus('no succeeding file to be switched to', 1);
          }
  });
  this.setBinding("Backspace", function() {
    this.delete();
  });
  this.setBinding("Enter", function() {
    this.shownFile.insert('\n');
    this.insertNewLine();
  });
}
