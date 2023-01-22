import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Quote } from '../../model/quote';

@Component({
  selector: 'quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.css']
})
export class QuoteDialogComponent {
  private backupQuote: Partial<Quote> = { ...this.data.quote };

  constructor(
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuoteDialogData
  ) {}

  cancel(): void {
    this.data.quote.text = this.backupQuote.text;
    this.data.quote.author = this.backupQuote.author;
    this.dialogRef.close(this.data);
  }
}

export interface QuoteDialogData {
  quote: Partial<Quote>;
  enableDelete: boolean;
}

export interface QuoteDialogResult {
  quote: Quote;
  delete?: boolean;
}