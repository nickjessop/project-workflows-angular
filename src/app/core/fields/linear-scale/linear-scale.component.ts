import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/interfaces/core-component';
import { FormGroup } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-linear-scale',
    templateUrl: './linear-scale.component.html',
    styleUrls: ['./linear-scale.component.scss'],
})
export class LinearScaleComponent extends BaseFieldComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
