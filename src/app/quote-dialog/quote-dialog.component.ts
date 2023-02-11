import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DbService } from '../../db/db.service';
import { IQuote, Quote } from '../../db/quote';

@Component({
  selector: 'quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.css']
})
export class QuoteDialogComponent {

  title = this.data.id == null ? 'New quote' : 'Edit quote';
  quoteForm: FormGroup;
  private quote: Quote;

  constructor(
    private dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IQuote,
    private db: DbService
  ) {
    this.dialogRef.addPanelClass('responsive-dialog');
    this.quote = new Quote(this.data, true);
    this.quoteForm = new FormGroup({
      text: new FormControl(this.quote.text, [Validators.required]),
      author: new FormControl(this.quote.author)
    });
  }

  confirm(): void {
    const tmp = this.quoteForm.value as Quote;
    this.quote.text = tmp.text;
    this.quote.author = tmp.author;
    this.dialogRef.close(this.db.setQuote(this.data));
  }
}