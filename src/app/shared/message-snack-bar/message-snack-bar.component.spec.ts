import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSnackBarComponent } from './message-snack-bar.component';
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

describe('MessageSnackBarComponent', () => {
  let component: MessageSnackBarComponent;
  let fixture: ComponentFixture<MessageSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageSnackBarComponent],
      providers: [
        { provide: MatSnackBar, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
