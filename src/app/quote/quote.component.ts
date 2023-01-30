import { Component, Input, Inject, Pipe, PipeTransform } from '@angular/core';
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
export class QuoteComponent {
  @Input() quote: Quote | null = null;

  constructor(private dialog: MatDialog, private db: DbService) {}

  copy(tooltip: MatTooltip, actionTooltip: MatTooltip): void {
    tooltip.hide();
    navigator.clipboard.writeText(`${this.quote?.text}\n(${this.quote?.author})`);
    actionTooltip.show();
    setTimeout(() => {
      actionTooltip.hide();
    }, 1000);
  }

  edit(quote: Quote): void {
    this.dialog.open(QuoteDialogComponent, { data: quote });
  }

  delete(quote: Quote): void {
    if (quote.id != null) {
      const dialogRef = this.dialog.open(DeleteQuoteDialog, {
        data: {
          text: quote.text,
          author: quote.author
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.db.deleteQuote(quote.id!);
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
    @Inject(MAT_DIALOG_DATA) public data: DeleteQuoteDialogData
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

interface DeleteQuoteDialogData {
  text: string,
  author: string
}