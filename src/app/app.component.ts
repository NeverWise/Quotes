import { Component, Inject, Pipe, PipeTransform, OnInit } from '@angular/core';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';
import { QuoteComponent } from './quote/quote.component';

import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { DbService } from '../db/db.service';
import { IQuote, Quote } from 'src/db/quote';
import { debounceTime, first, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Quotes';
  quotes = this.db.getQuotes(null);
  search = '';
  debounceSearch = new Subject<string>();

  private _showSearch: boolean = false;
  set showSearch(value: boolean) {
    this._showSearch = value;
    if (!value) {
      this.loadQuotes(null);
      this.search = '';
    }
  }
  get showSearch() {
    return this._showSearch;
  }

  constructor(
    private dialog: MatDialog,
    private db: DbService,
    private http: HttpClient
  ) {
    this.debounceSearch
      .pipe(debounceTime(300))
      .subscribe(() => this.loadQuotes(this.search));
  }

  private loadQuotes(search: string|null) {
    this.quotes = this.db.getQuotes(search);
  }

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
            const dialogRef = this.dialog.open(SuggestQuoteDialog, { data: select });
            dialogRef.afterClosed().subscribe(result => {
              if (result) this.db.setQuote(select).finally(() => this.loadQuotes(null));
            });
          }
        });
    });
  }

  newQuote(): void {
    this.dialog.open(QuoteDialogComponent, { data: {} }).afterClosed().subscribe(result => {
      if (result) result.finally(() => this.loadQuotes(this.search));
    });
  }

  copy(quote: Quote, tooltip: MatTooltip, actionTooltip: MatTooltip): void {
    tooltip.hide();
    navigator.clipboard.writeText(`${quote.text}\n(${quote.author})`);
    actionTooltip.show();
    setTimeout(() => {
      actionTooltip.hide();
    }, 1000);
  }

  edit(quote: IQuote, quoteComponent: QuoteComponent): void {
    this.dialog.open(QuoteDialogComponent, { data: quote }).afterClosed().subscribe(result => {
      if (result) quoteComponent.quote = quote;
    });
  }

  delete(quote: IQuote, vmQuote: Quote): void {
    if (quote.id != null) {
      const dialogRef = this.dialog.open(DeleteQuoteDialog, { data: vmQuote });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.db.deleteQuote(quote.id!).finally(() => this.loadQuotes(this.search));
      });
    }
  }

  toggleSearch(): void {
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
    @Inject(MAT_DIALOG_DATA) public data: IQuote
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
    @Inject(MAT_DIALOG_DATA) public data: IQuote
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