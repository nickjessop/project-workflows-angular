import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'project-step-dialog',
    templateUrl: './step-dialog.component.html',
    styleUrls: ['./step-dialog.component.scss'],
})
export class StepDialogComponent implements OnInit {
    @Input() title = '';
    @Input() description = '';
    @Input() status = '';
    @Output() onSavePress = new EventEmitter<{ title: string; description: string; status: string }>();

    public showDialog = false;
    public visibilityOptions = [
        { label: 'show', value: 'show' },
        { label: 'hide', value: 'hide' },
    ];

    public statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Important', value: 'important' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Completed', value: 'completed' },
    ];

    constructor() {}

    ngOnInit(): void {}

    public onNewStepPress() {
        this.showDialog = true;
    }

    public onStepSave() {
        if (!this.title && !this.description) {
            return;
        }

        this.onSavePress.emit({ title: this.title, description: this.description, status: this.status });
        this.clearStepDialog();
        this.showDialog = false;
    }

    private clearStepDialog() {
        this.title = '';
        this.description = '';
        this.status = '';
    }
}
