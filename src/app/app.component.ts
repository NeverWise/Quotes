import { Component } from '@angular/core';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';

import { DbService } from '../db/db.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quotes';
  quotes = this.db.getQuotes();
  showSearch = false;

  constructor(private dialog: MatDialog, private db: DbService) {}

  newQuote(): void {
    this.dialog.open(QuoteDialogComponent, { data: {} });
  }

  search(): void {
    this.showSearch = !this.showSearch;
  }

  onKeyEscape(): void {
    this.showSearch = false;
 }
}