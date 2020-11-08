import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockPanelOverlayComponent } from './block-overlay.component';

describe('BlockPanelOverlayComponent', () => {
    let component: BlockPanelOverlayComponent;
    let fixture: ComponentFixture<BlockPanelOverlayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BlockPanelOverlayComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BlockPanelOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
