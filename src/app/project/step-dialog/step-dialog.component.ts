import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Status, Step } from 'src/app/models/interfaces/project';

@Component({
    selector: 'project-step-dialog',
    templateUrl: './step-dialog.component.html',
    styleUrls: ['./step-dialog.component.scss'],
})
export class StepDialogComponent implements OnInit {
    @Input() step: Step = { title: '', description: '' };
    @Input() mode: 'edit' | 'new' | 'delete' = 'new';
    @Input() showDialog = false;
    @Output() dialogSubmitEvent = new EventEmitter<{ step?: Step; mode: 'edit' | 'new' | 'delete' }>();
    @Output() onHideEvent = new EventEmitter<true>();

    statusOptions: Status[];

    constructor() {
        this.statusOptions = [
            { label: 'In progress', value: 'in-progress', icon: 'pi-progress' },
            { label: 'Important', value: 'important', icon: 'pi-exclamation-circle' },
            { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' },
            { label: 'Completed', value: 'completed', icon: 'pi-check-circle' },
        ];
    }

    ngOnInit(): void {}

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
        if (this.mode !== 'delete' && (!this.step.title || !this.step.description)) {
            return;
        }

        this.dialogSubmitEvent.emit({ step: this.step, mode: this.mode });
    }

    public onHide($event: Event) {
        this.onHideEvent.emit(true);
    }
}
