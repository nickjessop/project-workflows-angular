import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Step } from '@project-workflows/interfaces';

@Component({
    selector: 'project-step',
    templateUrl: './step.component.html',
    styleUrls: ['./step.component.scss'],
})
export class StepComponent implements OnInit {
    public showMenu: boolean = false;
    @Output() toggleMenuChange: EventEmitter<boolean> = new EventEmitter();

    @Input() step: Step = { title: '', status: { label: 'No status', value: 'no-status', icon: '' }, description: '' };
    @Input() currentStep: any;

    constructor() {}

    ngOnInit(): void {}

    public toggleMenu() {
        this.toggleMenuChange.emit();
    }
}
