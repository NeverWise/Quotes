import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Quote } from './quote';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  quoteCollection = this.db.collection('quotes', ref => ref.orderBy('createDate', 'desc'));

  constructor(private db: AngularFirestore) { }

  getQuotes() {
    return this.quoteCollection.valueChanges({ idField: 'id' }) as Observable<Quote[]>;
  }

  getQuote(id: string) {
    return this.quoteCollection.doc(id);
  }

  addQuote(quote: Quote) {
    quote.id = undefined;
    return this.setQuote(quote);
  }

  setQuote(quote: Quote) {
    quote.editDate = new Date();
    if (quote.id == null) {
      quote.createDate = quote.editDate;
      return this.quoteCollection.add(quote);
    }
    else return this.getQuote(quote.id).update(quote);
  }

  deleteQuote(id: string) {
    return this.getQuote(id).delete();
  }
}