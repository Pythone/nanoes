export default class File {
  #name;

  #content;

  constructor(name) {
    this.#name = name;
    this.#content = '';
  }

  get name() {
    return this.#name;
  }

  get content() {
    return this.#content;
  }

  insert(text) {
    this.#content += text;
  }
}
