import { Component, Inject, Pipe, PipeTransform, OnInit } from '@angular/core';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';

import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { DbService } from '../db/db.service';
import { Quote } from 'src/db/quote';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Quotes';
  quotes = this.db.getQuotes();
  showSearch = false;

  constructor(
    private dialog: MatDialog,
    private db: DbService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.quotes.pipe(first()).subscribe(data_quotes => {
      // Dopo aver ottenuto i dati si effettua la chiamata per suggerire una citazione.
      this.http.get<any[]>('https://type.fit/api/quotes')
        .subscribe(data_suggestions => {
          let select: any = null, index = 0;
          while (index > -1 && data_suggestions.length > 0) {
            select = data_suggestions[Math.floor(Math.random() * data_suggestions.length)];
            index = data_quotes.findIndex(r => r.text === select.text && r.author === select.author);
            if (index > -1) data_suggestions.splice(index, 1);
          }
          if (index == -1) {
            const dialogRef = this.dialog.open(SuggestQuoteDialog, {
              data: {
                text: select.text,
                author: select.author
              },
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) this.db.setQuote(select);
            });
          }
        });
    });
  }

  newQuote(): void {
    this.dialog.open(QuoteDialogComponent, { data: {} });
  }

  copy(quote: Partial<Quote>, tooltip: MatTooltip, actionTooltip: MatTooltip): void {
    tooltip.hide();
    navigator.clipboard.writeText(`${quote.text}\n(${quote.author})`);
    actionTooltip.show();
    setTimeout(() => {
      actionTooltip.hide();
    }, 1000);
  }

  edit(quote: Quote): void {
    this.dialog.open(QuoteDialogComponent, { data: quote });
  }

  delete(quote: Quote, vmQuote: Partial<Quote>): void {
    if (quote.id != null) {
      const dialogRef = this.dialog.open(DeleteQuoteDialog, {
        data: {
          text: vmQuote.text,
          author: vmQuote.author
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.db.deleteQuote(quote.id!);
      });
    }
  }

  search(): void {
    this.showSearch = !this.showSearch;
  }

  onKeyEscape(): void {
    this.showSearch = false;
 }
}

@Component({
  selector: 'delete-quote-dialog',
  templateUrl: 'quote/delete-quote-dialog.html',
})
export class DeleteQuoteDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteQuoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Quote
  ) {
    this.dialogRef.addPanelClass('responsive-dialog');
  }
}

@Component({
  selector: 'suggest-quote-dialog',
  templateUrl: 'quote/suggest-quote-dialog.html',
})
export class SuggestQuoteDialog {
  constructor(
    public dialogRef: MatDialogRef<SuggestQuoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Quote
  ) {
    this.dialogRef.addPanelClass('responsive-dialog');
  }
}

@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(target: string, maxLength: number = 300) {
    const htmlStripped = target.replace(/(<([^>]+)>)/gi, '');

    if (htmlStripped.length >= maxLength) {
      return `${htmlStripped.slice(0, maxLength)}...`;
    }
    return htmlStripped;
  }
}