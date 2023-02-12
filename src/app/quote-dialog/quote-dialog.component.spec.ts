import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteDialogComponent } from './quote-dialog.component';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

describe('QuoteDialogComponent new', () => {
  let component: QuoteDialogComponent;
  let fixture: ComponentFixture<QuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteDialogComponent ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        { provide: MatDialogRef, useValue: { addPanelClass: (val: string) => val} },
        { provide: MAT_DIALOG_DATA, useValue: { } }
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

  it('form validation', () => {
    expect(component.title).toEqual('New quote');
    const textField = component.quoteForm.controls['text'];
    expect(textField.invalid).toBeTruthy();
    expect(component.quoteForm.invalid).toBeTruthy();
    const okBtnQueryStr = 'button[color="primary"]'
    expect(fixture.nativeElement.querySelector(okBtnQueryStr).disabled).toBeTruthy();

    textField.setValue('testo');
    fixture.detectChanges();

    expect(textField.valid).toBeTruthy();
    expect(component.quoteForm.valid).toBeTruthy();
    expect(fixture.nativeElement.querySelector(okBtnQueryStr).disabled).toBeFalsy();

    textField.setValue('');
    fixture.detectChanges();

    expect(textField.invalid).toBeTruthy();
    expect(component.quoteForm.invalid).toBeTruthy();
    expect(fixture.nativeElement.querySelector(okBtnQueryStr).disabled).toBeTruthy();
  });
});

describe('QuoteDialogComponent edit', () => {
  let component: QuoteDialogComponent;
  let fixture: ComponentFixture<QuoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteDialogComponent ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        { provide: MatDialogRef, useValue: { addPanelClass: (val: string) => val} },
        { provide: MAT_DIALOG_DATA,
          useValue: {
            id: 'asd',
            text: 'testo',
            author: 'autore',
            createDate: new Date(),
            editDate: new Date(),
            keywords: ['testo', 'autore']
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form validation', () => {
    expect(component.title).toEqual('Edit quote');
    expect(component.quoteForm.controls['text'].valid).toBeTruthy();
    expect(component.quoteForm.valid).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button[color="primary"]').disabled).toBeFalsy();
  });

  it('Ok button should call confirm method', () => {
    spyOn(component, 'confirm');
    fixture.nativeElement.querySelector('button[color="primary"]').click();
    expect(component.confirm).toHaveBeenCalledTimes(1);
  });
});