import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Quote } from '../model/quote';
import { QuoteDialogComponent, QuoteDialogResult } from './quote-dialog/quote-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quotes';
  collection = this.store.collection('quotes');
  quotes = this.collection.valueChanges({ idField: 'id' }) as Observable<Quote[]>;

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  newQuote(): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '270px',
      data: {
        quote: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: QuoteDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.collection.add(result.quote);
      });
  }

  editQuote(quote: Quote): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      width: '270px',
      data: {
        quote,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: QuoteDialogResult | undefined) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.collection.doc(quote.id).delete();
      } else {
        this.collection.doc(quote.id).update(quote);
      }
    });
  }

}