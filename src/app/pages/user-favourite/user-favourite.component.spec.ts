import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavouriteComponent } from './user-favourite.component';

describe('UserFavouriteComponent', () => {
  let component: UserFavouriteComponent;
  let fixture: ComponentFixture<UserFavouriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavouriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
