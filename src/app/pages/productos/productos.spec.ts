import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Productos } from './productos';

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productos, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
