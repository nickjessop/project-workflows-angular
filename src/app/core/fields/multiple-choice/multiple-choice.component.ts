import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/interfaces/core-component';
import { FormGroup } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-multiple-choice',
    templateUrl: './multiple-choice.component.html',
    styleUrls: ['./multiple-choice.component.scss'],
})
export class MultipleChoiceComponent extends BaseFieldComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
