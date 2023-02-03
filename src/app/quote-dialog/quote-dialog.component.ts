import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DbService } from '../../db/db.service';
import { Quote } from '../../db/quote';

@Component({
  selector: 'quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.css']
})
export class QuoteDialogComponent {

  title = this.data.id == null ? 'New quote' : 'Edit quote';
  quoteForm = new FormGroup({
    text: new FormControl(this.data.text, [Validators.required]),
    author: new FormControl(this.data.author)
  });

  constructor(
    private dialogRef: MatDialogRef<QuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Quote,
    private db: DbService
  ) {
    this.dialogRef.addPanelClass('responsive-dialog');
  }

  confirm(): void {
    const tmp = this.quoteForm.value as Quote;
    this.data.text = tmp.text;
    this.data.author = tmp.author;
    this.db.setQuote(this.data);
    this.dialogRef.close();
  }
}