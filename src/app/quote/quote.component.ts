import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Quote } from '../../db/quote';

@Component({
  selector: 'quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnChanges {
  @Input() quote: Quote | null = null;
  vmQuote: Partial<Quote> = { };

  ngOnChanges(changes: SimpleChanges) {
    this.vmQuote.text = changes['quote'].currentValue.text;
    this.vmQuote.author = changes['quote'].currentValue.author || 'Anonimus';
  }
}