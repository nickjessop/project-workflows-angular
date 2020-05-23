import { createFieldConfigDefault, FieldConfig } from '../../../models/interfaces/core-component';
import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() field: FieldConfig = createFieldConfigDefault();
    @Input() group!: FormGroup;

    constructor() {}

    ngOnInit() {}
}
