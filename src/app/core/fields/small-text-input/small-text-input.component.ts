import { Component, OnInit } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-small-text-input',
    templateUrl: './small-text-input.component.html',
    styleUrls: ['./small-text-input.component.scss'],
})
export class SmallTextInputComponent extends BaseFieldComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
