import { Component, OnInit } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-checkboxes',
    templateUrl: './checkboxes.component.html',
    styleUrls: ['./checkboxes.component.scss'],
})
export class CheckboxesComponent extends BaseFieldComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
