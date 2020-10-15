import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project, Step } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
    private subscriptions = new Subscription();

    public project?: Project;
    public steps?: Step[] = [];
    public currentStep?: Step;

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.initializeProject();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private getSteps(project: Project) {
        if (project.configuration) {
            return project.configuration.map(_project => {
                return _project.step;
            });
        }

        return;
    }

    private initializeProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                this.project = _project;
                this.steps = this.getSteps(_project);
            })
        );
    }

    public onStepPress(index: number) {
        const currentStepConfig = this.project?.configuration?.[index];

        if (currentStepConfig) {
            if (currentStepConfig.components) {
                this.projectService.currentStep = currentStepConfig.components;
            }
            this.currentStep = currentStepConfig.step;
        }
    }

    public onNewStepPress(event: Event) {
        const newStepIndex = this.project?.configuration?.length ? this.project?.configuration?.length : 0;
        const newStep = this.projectService.createNewProjectStep();

        const project = this.projectService.projectConfig;
        project.configuration?.push(newStep);

        this.projectService.projectConfig = project;
        this.projectService.currentStep = newStep.components;
    }
}
