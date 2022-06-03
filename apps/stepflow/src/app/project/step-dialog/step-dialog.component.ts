import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Status, Step } from '@stepflow/interfaces';

@Component({
    selector: 'project-step-dialog',
    templateUrl: './step-dialog.component.html',
    styleUrls: ['./step-dialog.component.scss'],
})
export class StepDialogComponent implements OnInit {
    @Input() step: Step = {
        title: '',
        description: '',
        status: { label: 'No status', value: 'no-status', icon: '' },
    };
    @Input() mode: 'edit' | 'new' | 'delete' = 'new';
    @Input() showDialog = false;
    @Output() dialogSubmitEvent = new EventEmitter<{ step?: Step; mode: 'edit' | 'new' | 'delete' }>();
    @Output() onHideEvent = new EventEmitter<true>();
    public showError: boolean = false;

    public statusOptions: Status[];
    public selectedStatus: Status = { label: 'No status', value: 'no-status', icon: '' };

    constructor() {
        this.statusOptions = [
            { label: 'No status', value: 'no-status', icon: '' },
            { label: 'In progress', value: 'in-progress', icon: 'pi-step-inprogress' },
            { label: 'Needs review', value: 'needs-review', icon: 'pi-step-important' },
            { label: 'Upcoming', value: 'upcoming', icon: 'pi-step-upcoming' },
            { label: 'Completed', value: 'completed', icon: 'pi-step-completed' },
        ];
    }

    ngOnInit(): void {
        if (this.mode === 'edit' && this.step.status) {
            this.selectedStatus = this.step.status;
        }
    }

    public getButtonLabel() {
        const componentMode = this.mode;
        if (componentMode === 'new') {
            return 'Add';
        } else if (componentMode === 'edit') {
            return 'Save';
        } else if (componentMode === 'delete') {
            return 'Delete';
        }

        return '';
    }

    public onDialogSubmit($event: Event) {
        if (this.mode !== 'delete' && !this.step.title) {
            this.showError = true;
            return;
        }
        this.step.status = this.selectedStatus;

        this.dialogSubmitEvent.emit({ step: this.step, mode: this.mode });
    }

    public onHide($event: Event) {
        this.onHideEvent.emit(true);
    }
}
