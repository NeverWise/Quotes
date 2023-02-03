import { Component, Input, Inject, Pipe, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';

import { DbService } from '../../db/db.service';
import { Quote } from '../../db/quote';

@Component({
  selector: 'quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnChanges {
  @Input() quote: Quote | null = null;
  vmQuote: Partial<Quote> = { };

  constructor(private dialog: MatDialog, private db: DbService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.vmQuote.text = changes['quote'].currentValue.text;
    this.vmQuote.author = changes['quote'].currentValue.author || 'Anonimus';
  }

  copy(tooltip: MatTooltip, actionTooltip: MatTooltip): void {
    tooltip.hide();
    navigator.clipboard.writeText(`${this.vmQuote?.text}\n(${this.vmQuote?.author})`);
    actionTooltip.show();
    setTimeout(() => {
      actionTooltip.hide();
    }, 1000);
  }

  edit(): void {
    this.dialog.open(QuoteDialogComponent, { data: this.quote });
  }

  delete(): void {
    if (this.quote?.id != null) {
      const dialogRef = this.dialog.open(DeleteQuoteDialog, {
        data: {
          text: this.vmQuote.text,
          author: this.vmQuote.author
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.db.deleteQuote(this.quote?.id!);
      });
    }
  }
}

@Component({
  selector: 'delete-quote-dialog',
  templateUrl: 'delete-quote-dialog.html',
})
export class DeleteQuoteDialog {
  constructor(
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
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