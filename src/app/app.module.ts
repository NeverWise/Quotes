import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { A11yModule } from '@angular/cdk/a11y'
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent, DeleteQuoteDialog, EllipsisPipe, SuggestQuoteDialog } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { DbService } from '../db/db.service';

@NgModule({
  declarations: [
    AppComponent,
    QuoteComponent,
    DeleteQuoteDialog,
    QuoteDialogComponent,
    EllipsisPipe,
    SuggestQuoteDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    A11yModule, // Set focus to the input search when it appear.
    HttpClientModule
  ],
  providers: [
    DbService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }