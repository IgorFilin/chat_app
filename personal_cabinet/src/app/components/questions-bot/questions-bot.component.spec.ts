import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsBotComponent } from './questions-bot.component';

describe('QuestionsBotComponent', () => {
  let component: QuestionsBotComponent;
  let fixture: ComponentFixture<QuestionsBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsBotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionsBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
