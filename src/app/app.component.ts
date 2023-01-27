import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuoteDialogComponent, QuoteDialogResult } from './quote-dialog/quote-dialog.component';

import { DbService } from '../db/db.service';
import { Quote } from '../db/quote';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quotes';
  quotes = this.db.getQuotes();

  constructor(private dialog: MatDialog, private db: DbService) {}

  newQuote(): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      panelClass: 'responsive-dialog',
      //height: '100%',
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
        this.db.createQuote(result.quote);
      });
  }

  editQuote(quote: Quote): void {
    const dialogRef = this.dialog.open(QuoteDialogComponent, {
      panelClass: 'responsive-dialog',
      //height: '100%',
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
        this.db.deleteQuote(quote.id!);
      } else {
        this.db.updateQuote(quote);
      }
    });
  }

}