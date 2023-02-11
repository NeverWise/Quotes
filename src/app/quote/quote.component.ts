import { Component, Input } from '@angular/core';
import { IQuote, Quote } from '../../db/quote';

@Component({
  selector: 'quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent {

  vmQuote: Quote = new Quote({ });

  private _quote: IQuote | null = null;
  @Input() set quote(value: IQuote) {
    this._quote = value;
    this.vmQuote = new Quote(this._quote);
  }
  get quote(): IQuote {
    if (!this._quote) throw new Error('quote field has not been set yet!');
    return this._quote;
  }
}