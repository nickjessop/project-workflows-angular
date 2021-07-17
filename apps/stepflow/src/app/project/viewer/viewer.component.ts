import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { ComponentMode } from '../../core/interfaces/core-component';
import { Project, StepConfig } from '../../models/interfaces/project';
import { ProjectService } from '../../services/project/project.service';

@Component({
    selector: 'project-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent {
    private subscriptions = new Subscription();

    public project?: Project;
    public currentStep?: StepConfig;
    public componentMode?: ComponentMode;
    public isNewProject = false;

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {
        this.initProject();
    }

    private initProject() {
        this.subscriptions.add(
            this.route.data.subscribe(data => {
                const projectId = data.data as string | undefined;

                if (projectId) {
                    this.projectService.subscribeAndSetProject(projectId);
                }
            })
        );

        this.subscriptions.add(
            combineLatest([this.projectService.projectConfig$, this.projectService.projectMode$]).subscribe(result => {
                this.currentStep = result[0]?.configuration?.find(stepConfig => {
                    return stepConfig.step.isCurrentStep;
                });

                this.project = result[0];
                this.componentMode = result[1];
            })
        );
    }

    ngOnDestroy() {
        this.projectService.resetProject();
    }

    public onDragAndDropEvent(event: any) {
        this.projectService.swapBlockOrder(event.previousIndex, event.currentIndex);
    }

    public onDragAndDropStepEvent(event: any) {
        this.projectService.swapStepOrder(event.previousIndex, event.currentIndex);
    }
}
