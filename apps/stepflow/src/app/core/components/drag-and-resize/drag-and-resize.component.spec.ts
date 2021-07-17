import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DragAndResizeComponent } from './drag-and-resize.component';

describe('DragComponent', () => {
    let component: DragAndResizeComponent;
    let fixture: ComponentFixture<DragAndResizeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DragAndResizeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DragAndResizeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
