import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Quote } from '../../db/quote';

@Component({
  selector: 'quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent {
  @Input() quote: Quote | null = null;
  @Output() edit = new EventEmitter<Quote>();

  copy(): void {
    navigator.clipboard.writeText(`${this.quote?.text}\n(${this.quote?.author})`);
    // TODO: Aggiungere tooltip che comunica che il testo è stato copiato!
  }
}