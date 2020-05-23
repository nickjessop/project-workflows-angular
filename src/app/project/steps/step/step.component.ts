import { Component, Input, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/interfaces/core-component';

@Component({
    selector: 'app-step',
    templateUrl: './step.component.html',
    styleUrls: ['./step.component.scss'],
})
export class StepComponent implements OnInit {
    @Input() title = '';
    @Input() completed = false;
    @Input() focused = false;

    constructor() {}

    ngOnInit() {}
}
