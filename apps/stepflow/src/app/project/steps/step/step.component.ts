import { Component, Input, OnInit } from '@angular/core';
import { Step } from '@stepflow/interfaces';

@Component({
    selector: 'project-step',
    templateUrl: './step.component.html',
    styleUrls: ['./step.component.scss'],
})
export class StepComponent implements OnInit {
    @Input() step: Step = { title: '', status: { label: 'No status', value: 'no-status', icon: '' }, description: '' };

    constructor() {}

    ngOnInit(): void {}
}
