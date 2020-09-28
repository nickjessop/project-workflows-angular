import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
    @Input() radioLabel = 'Option';
    @Input() disabled = false;

    constructor() {}

    ngOnInit() {}
}
