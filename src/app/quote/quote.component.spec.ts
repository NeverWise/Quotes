import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteComponent } from './quote.component';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';

import { MatDialogModule } from '@angular/material/dialog';

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComponent ],
      imports: [
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebase),
      ],
      providers: [
        AngularFirestore,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
