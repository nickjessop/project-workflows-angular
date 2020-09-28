import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() label = '';

    constructor() {}

    ngOnInit() {}
}
