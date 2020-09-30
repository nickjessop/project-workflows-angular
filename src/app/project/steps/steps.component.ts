import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FieldConfig } from 'src/app/models/interfaces/core-component';
import { Project, Step } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { parseConfigFileTextToJson } from 'typescript';

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
        if (this.project?.configuration?.[index]) {
            const currentStepConfig = this.project.configuration[index];

            this.projectService.currentStep = currentStepConfig.components;
            this.currentStep = currentStepConfig.step;
        }
    }
}
