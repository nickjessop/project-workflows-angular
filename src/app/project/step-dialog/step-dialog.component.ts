import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Status, Step } from 'src/app/models/interfaces/project';

@Component({
    selector: 'project-step-dialog',
    templateUrl: './step-dialog.component.html',
    styleUrls: ['./step-dialog.component.scss'],
})
export class StepDialogComponent implements OnInit {
    @Input() titleInput = '';
    @Input() descriptionInput = '';
    @Input() statusInput: Status = { label: 'Active', value: 'active', icon: 'pi-circle-off' };
    @Output() onSavePress = new EventEmitter<Step>();

    public showDialog = false;
    public visibilityOptions = [
        { label: 'show', value: 'show' },
        { label: 'hide', value: 'hide' },
    ];

    statusOptions: Status[];

    constructor() {
        this.statusOptions = [
            { label: 'Active', value: 'active', icon: 'pi-circle-off' },
            { label: 'Important', value: 'important', icon: 'pi-exclamation-circle' },
            { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' },
            { label: 'Completed', value: 'completed', icon: 'pi-check-circle' },
        ];
    }

    ngOnInit(): void {}

    public onNewStepPress() {
        this.showDialog = true;
    }

    public onStepSave() {
        if (!this.titleInput && !this.descriptionInput) {
            return;
        }
        this.onSavePress.emit({ title: this.titleInput, description: this.descriptionInput, status: this.statusInput });
        this.clearStepDialog();
        this.showDialog = false;
    }

    private clearStepDialog() {
        this.titleInput = '';
        this.descriptionInput = '';
        this.statusInput = { label: 'Active', value: 'active', icon: 'pi-circle-off' };
    }
}
