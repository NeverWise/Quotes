import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Quote } from '../../db/quote';

@Component({
  selector: 'quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.css']
})
export class QuoteDialogComponent {
  private backupQuote: Partial<Quote> = { ...this.data.quote };

  quoteForm = new FormGroup({
    text: new FormControl(this.data.quote.text, [Validators.required]),
    author: new FormControl(this.data.quote.author)
  });

  constructor(
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuoteDialogData
  ) {}

  confirm(): void {
    const tmp = this.quoteForm.value as Partial<Quote>;
    this.data.quote.text = tmp.text;
    this.data.quote.author = tmp.author;
    this.dialogRef.close(this.data);
  }

  cancel(): void {
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