import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../models/interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends BaseFieldComponent implements OnInit {
    @Input() checkboxLabel = 'Option';
    @Input() disabled = false;

    constructor() {
        super();
    }

    ngOnInit() {}
}
