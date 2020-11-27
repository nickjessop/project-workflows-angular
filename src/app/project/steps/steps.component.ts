import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project, StepConfig } from 'src/app/models/interfaces/project';
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

    public onStepPress(stepIndex: number) {
        this.projectService.setNewCurrentProjectStep(stepIndex);
    }

    public onSavePress(event: { title: string; description: string }) {
        console.log(`Saved pressed with title: ${event.title} and description: ${event.description}`);
        this.onNewStepPress(event);
    }

    private onNewStepPress(stepConfig: { title: string; description: string }) {
        const newStep = this.projectService.createNewProjectStep();
        newStep.step.description = stepConfig.description;
        newStep.step.title = stepConfig.title;

        this.projectService.addProjectStep(newStep);
    }
}
