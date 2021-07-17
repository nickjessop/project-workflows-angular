import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Project, Status, Step, StepConfig } from '../../models/interfaces/project';
import { ProjectService } from '../../services/project/project.service';
@Component({
    selector: 'project-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
    private subscriptions = new Subscription();

    public project?: Project;
    public steps: StepConfig[] = [];
    public currentStep?: StepConfig;

    @Output() dragAndDropStepEvent: EventEmitter<{
        previousIndex: number;
        currentIndex: number;
    }> = new EventEmitter();

    public showDialog = false;
    public stepMode: 'edit' | 'new' | 'delete' = 'edit';
    public focusStep: Step = {
        title: '',
        description: '',
        status: { label: 'No status', value: 'no-status', icon: '' },
    };

    statusOptions: Status[];

    constructor(private projectService: ProjectService) {
        this.statusOptions = [
            { label: 'No status', value: 'no-status', icon: '' },
            { label: 'In progress', value: 'in-progress', icon: 'pi-progress' },
            { label: 'Needs review', value: 'needs-review', icon: 'pi-exclamation-circle' },
            { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' },
            { label: 'Completed', value: 'completed', icon: 'pi-check-circle' },
        ];
    }

    ngOnInit() {
        this.initializeProject();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private initializeProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                if (_project) {
                    this.project = _project;

                    if (_project.configuration) {
                        this.steps = _project.configuration;
                        this.currentStep = _project.configuration[0];
                    }
                }
            })
        );
    }

    public stepMenuOptions: MenuItem[] = [
        {
            label: 'Edit Step',
            icon: 'pi pi-pencil',
            command: () => {
                this.onEditCurrentStep();
            },
        },
        {
            label: 'Delete Step',
            icon: 'pi pi-trash',
            command: () => {
                this.onDeleteCurrentStep();
            },
        },
    ];

    public onStepPress(stepIndex: number) {
        this.projectService.setNewCurrentProjectStep(stepIndex);
    }

    public onAddNewStepPress() {
        this.openDialog('new');
    }

    private onEditCurrentStep() {
        const currentStep = this.projectService.getCurrentStep();

        this.openDialog('edit', currentStep);
    }

    private onDeleteCurrentStep() {
        const currentStep = this.projectService.getCurrentStep();

        this.openDialog('delete', currentStep);
    }

    public openDialog(stepMode: 'edit' | 'new' | 'delete', step?: Step) {
        if (stepMode === 'edit' && step) {
            this.focusStep = _.cloneDeep(step);
            this.stepMode = 'edit';
            this.showDialog = true;
        } else if (stepMode === 'new') {
            this.focusStep = {
                description: '',
                title: '',
                status: { label: 'No status', value: 'no-status', icon: '' },
            };
            this.stepMode = 'new';
            this.showDialog = true;
        } else if (stepMode == 'delete' && step) {
            this.focusStep = _.cloneDeep(step);
            this.stepMode = 'delete';
            this.showDialog = true;
        }
    }

    public onDialogSubmitEvent($event: { step?: Step; mode: 'edit' | 'new' | 'delete' }) {
        this.showDialog = false;

        const mode = $event.mode;
        if (mode === 'edit') {
            if ($event.step) {
                this.projectService.updateProjectStep($event.step);
            }
        } else if (mode === 'new') {
            if ($event.step) {
                const newStep = this.projectService.createNewProjectStep();
                newStep.step = $event.step;
                this.projectService.addProjectStep(newStep);
            }
        } else if (mode === 'delete') {
            this.projectService.deleteCurrentProjectStep();
        }
    }

    drop(event: CdkDragDrop<any>) {
        this.dragAndDropStepEvent.emit({
            previousIndex: event.previousIndex,
            currentIndex: event.currentIndex,
        });
    }

    public onHideEvent($event: true) {
        this.showDialog = false;
    }
}
