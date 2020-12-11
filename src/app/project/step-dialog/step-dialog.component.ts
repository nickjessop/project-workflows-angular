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
    @Output() onSavePress = new EventEmitter<Step>();

    @Input() showDialog!: boolean;
    @Input() dialogTitle!: string;
    @Input() dialogEdit!: boolean;
    @Output() displayChange = new EventEmitter<boolean>();

    @Input() dialogStep!: Step;

    public visibilityOptions = [
        { label: 'show', value: 'show' },
        { label: 'hide', value: 'hide' },
    ];

    selectedStatus: Status | undefined;
    statusOptions: Status[];

    constructor() {
        this.statusOptions = [
            { label: 'In progress', value: 'in-progress', icon: 'pi-progress' },
            { label: 'Important', value: 'important', icon: 'pi-exclamation-circle' },
            { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' },
            { label: 'Completed', value: 'completed', icon: 'pi-check-circle' },
        ];
    }

    ngOnInit(): void {
        this.setStepValues();
    }

    public setStepValues() {
        // set initial step values unless we receive them from step.component
        if (!this.dialogStep) {
            this.dialogStep = {
                title: '',
                description: '',
                status: this.selectedStatus,
            };
        } else {
            this.titleInput = this.dialogStep.title;
            this.descriptionInput = this.dialogStep.description;
            this.selectedStatus = this.dialogStep.status;
        }
    }

    public onStepSave() {
        if (!this.titleInput && !this.descriptionInput) {
            return;
        }
        this.onSavePress.emit({
            title: this.titleInput,
            description: this.descriptionInput,
            status: this.selectedStatus,
        });
        this.onHide();
    }

    private clearStepDialog() {
        this.titleInput = '';
        this.descriptionInput = '';
        // this.selectedStatus = '';
        this.dialogStep = {
            title: '',
            description: '',
        };
    }

    public onHide() {
        this.clearStepDialog();
        this.displayChange.emit(false);
    }

    ngOnDestroy() {
        this.displayChange.unsubscribe();
    }
}
