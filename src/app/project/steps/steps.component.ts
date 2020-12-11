import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Project, Step, StepConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

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
    public focusStep: Step = { title: '', description: '' };

    constructor(private projectService: ProjectService) {}

    //TODO
    // STEP STATUSES: COMPLETED, UPCOMING, AND IMPORTANT - these aren't functional but convey info (icon + badge in step header)
    // STEP STATES: LOCKED AND HIDDEN - these are functional. one makes the step read-only for particpants+, the other hides from participants+
    ngOnInit() {
        this.initializeProject();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private initializeProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                this.project = _project;
                if (_project.configuration) {
                    this.steps = _project.configuration;
                    this.currentStep = _project.configuration[0];
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
            icon: 'pi pi-times',
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
        this.openDialog('delete');
    }

    public openDialog(stepMode: 'edit' | 'new' | 'delete', step?: Step) {
        if (stepMode === 'edit' && step) {
            this.focusStep = step;
            this.stepMode = 'edit';
            this.showDialog = true;
        } else if (stepMode === 'new') {
            this.focusStep = { description: '', title: '' };
            this.stepMode = 'new';
            this.showDialog = true;
        } else if (stepMode == 'delete') {
            this.stepMode = 'delete';
            console.log('Delete triggered');
        }
    }

    public onDialogSubmitEvent($event: { step?: Step; mode: 'edit' | 'new' | 'delete' }) {
        this.showDialog = false;

        const mode = $event.mode;
        if (mode === 'edit') {
            console.log('Edit submit event called', $event);
            if ($event.step) {
                this.projectService.updateProjectStep($event.step);
            }
        } else if (mode === 'new') {
            console.log('New submit event called', $event);
            if ($event.step) {
                const newStep = this.projectService.createNewProjectStep();
                newStep.step = $event.step;
                this.projectService.addProjectStep(newStep);
            }
        } else if (mode === 'delete') {
            console.log('Delete submit event called', $event);
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
