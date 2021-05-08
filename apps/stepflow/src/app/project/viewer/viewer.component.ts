import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComponentMode } from '../../core/interfaces/core-component';
import { Project, StepConfig } from '../../models/interfaces/project';
import { ProjectService } from '../../services/project/project.service';

@Component({
    selector: 'project-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
    private subscriptions = new Subscription();

    public project?: Project;
    public currentStep?: StepConfig;
    public componentMode: ComponentMode = 'edit';
    public isNewProject = false;

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.initProject();
        this.initRouteData();
    }

    private initProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                if (_project) {
                    this.project = _project;
                    this.currentStep = _project.configuration?.find(stepConfig => {
                        return stepConfig.step.isCurrentStep;
                    });
                }
            })
        );

        // Here we set the mode of the project, we can go further and set individual modes per component
        this.componentMode = this.projectService.projectMode;

        this.subscriptions.add(
            this.projectService.projectMode$.subscribe(componentMode => {
                if (componentMode) {
                    console.log(componentMode);
                    this.componentMode = componentMode;
                }
            })
        );
    }
    private initRouteData() {
        this.subscriptions.add(
            this.route.data.subscribe(data => {
                this.isNewProject = data.data.isNewProject;
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.projectService.resetProject();
    }

    public onDragAndDropEvent(event: any) {
        this.projectService.swapBlockOrder(event.previousIndex, event.currentIndex);
    }

    public onDragAndDropStepEvent(event: any) {
        this.projectService.swapStepOrder(event.previousIndex, event.currentIndex);
    }
}
