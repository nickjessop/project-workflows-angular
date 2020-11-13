import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'project-step-dialog',
    templateUrl: './step-dialog.component.html',
    styleUrls: ['./step-dialog.component.scss'],
})
export class StepDialogComponent implements OnInit {
    @Input() title = '';
    @Input() description = '';
    @Output() onSavePress = new EventEmitter<{ title: string; description: string }>();

    public showDialog = false;
    public visibilityOptions = [
        { label: 'show', value: 'show' },
        { label: 'hide', value: 'hide' },
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

        this.onSavePress.emit({ title: this.title, description: this.description });
        this.clearStepDialog();
        this.showDialog = false;
    }

    private clearStepDialog() {
        this.title = '';
        this.description = '';
    }
}
