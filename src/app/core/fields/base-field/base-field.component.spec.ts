import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFieldComponent } from './base-field.component';

describe('BaseFieldComponent', () => {
    let component: BaseFieldComponent;
    let fixture: ComponentFixture<BaseFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BaseFieldComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
