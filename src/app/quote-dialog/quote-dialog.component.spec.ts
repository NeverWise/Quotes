import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteDialogComponent } from './quote-dialog.component';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('QuoteDialogComponent', () => {
  let component: QuoteDialogComponent;
  let fixture: ComponentFixture<QuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteDialogComponent ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        { provide: MatDialogRef, useValue: { addPanelClass: (val: string) => val} },
        { provide: MAT_DIALOG_DATA, useValue: { } },
        AngularFirestore
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
