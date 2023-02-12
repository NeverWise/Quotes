import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { IQuote } from './quote';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private quoteCollection = this.getQuoteCollection(null);

  constructor(private db: AngularFirestore) { }

  private getQuoteCollection(search: string|null) {
    return this.db.collection('quotes', ref => {
      let query = ref.orderBy('createDate', 'desc');
      if (search) query = query.where('keywords', 'array-contains-any', search.toLowerCase().split(' '));
      return query;
    });
  }

  getQuotes(search: string|null) {
    return (this.getQuoteCollection(search).get() as Observable<QuerySnapshot<IQuote>>)
      .pipe(map(snap => snap.docs.map(doc => { return { id: doc.id, ...doc.data() }; })));
  }

  getQuote(id: string) {
    return this.quoteCollection.doc(id);
  }

  addQuote(quote: IQuote) {
    quote.id = undefined;
    return this.setQuote(quote);
  }

  setQuote(quote: IQuote) {
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