export interface IQuote {
  id?: string;
  text: string;
  author: string;
  createDate: Date;
  editDate: Date;
  keywords: string[];
}

export class Quote {

  private _quote: Partial<IQuote>;
  private _isEdit: boolean;

  constructor(quote: Partial<IQuote>, isEdit: boolean = false) {
    this._quote = quote;
    this._isEdit = isEdit;
    this.setKeywords();
  }

  // text property.
  set text(value: string) {
    this._quote.text = value;
    this.setKeywords();
  }
  get text() {
    return this._quote.text || '';
  }

  // author property.
  set author(value: string) {
    this._quote.author = value;
    this.setKeywords();
  }
  get author() {
    return this._isEdit ? this._quote.author || '' : this.getAuthor();
  }
  private getAuthor(){
    return this._quote.author || 'Anonimus';
  }

  // Format keywords.
  private setKeywords() {
    this._quote.keywords = [ ...new Set([ ...this.buildKeywords(this.text), ...this.buildKeywords(this.getAuthor()) ]) ];
  }

  private buildKeywords(text: string) {
    return text.replace(/[^\w\s\']|_/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .split(' ');
  }
}