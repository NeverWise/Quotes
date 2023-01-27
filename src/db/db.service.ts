import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Quote } from './quote';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  quoteCollection = this.db.collection('quotes');

  constructor(private db: AngularFirestore) { }

  getQuotes() {
    return this.quoteCollection.valueChanges({ idField: 'id' }) as Observable<Quote[]>;
  }

  getQuote(id: string) {
    return this.quoteCollection.doc(id);
  }

  createQuote(quote: Quote) {
    return this.quoteCollection.add(quote);
  }

  updateQuote(quote: Quote) {
    return quote.id == null ?
      this.quoteCollection.add(quote) :
      this.getQuote(quote.id).update(quote);
  }

  deleteQuote(id: string) {
    return this.getQuote(id).delete();
  }
}