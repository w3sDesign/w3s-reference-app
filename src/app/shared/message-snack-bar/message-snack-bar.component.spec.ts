import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageSnackBarComponent } from './message-snack-bar.component';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { MatSnackBar } from '@angular/material';

describe('MessageSnackBarComponent', () => {
  let component: MessageSnackBarComponent;
  let fixture: ComponentFixture<MessageSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedMaterialModule,
      ],
      declarations: [MessageSnackBarComponent],
      providers: [
        { provide: MatSnackBar, useValue: {} },
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
