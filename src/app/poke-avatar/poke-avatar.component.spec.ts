import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeAvatarComponent } from './poke-avatar.component';

describe('PokeAvatarComponent', () => {
  let component: PokeAvatarComponent;
  let fixture: ComponentFixture<PokeAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokeAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
