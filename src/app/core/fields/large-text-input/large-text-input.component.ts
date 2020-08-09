import { Component, OnInit } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-large-text-input',
    templateUrl: './large-text-input.component.html',
    styleUrls: ['./large-text-input.component.scss'],
})
export class LargeTextInputComponent extends BaseFieldComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
