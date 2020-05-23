import { Component, OnInit, Input } from '@angular/core';
import { FieldConfig } from '../../../models/interfaces/core-component';
import { FormGroup } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent extends BaseFieldComponent implements OnInit {
    @Input() radioLabel = 'Option';
    @Input() disabled = false;

    constructor() {
        super();
    }

    ngOnInit() {}
}
