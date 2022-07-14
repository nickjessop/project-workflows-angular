import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectMode, SharePermission, StepConfig } from '@stepflow/interfaces';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/project/project.service';

@Component({
    selector: 'project-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnDestroy {
    private subscriptions: Subscription = new Subscription();

    public project?: Project;
    public currentStep?: StepConfig;
    public projectMode?: ProjectMode;
    public isNewProject = false;
    public canConfigureProject = false;

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {
        this.initProject();
    }

    private async initProject() {
        const routeParams = this.route.snapshot.params;
        const projectId = routeParams.projectId as string;
        const userId = routeParams.userId as string;
        const sharePermission = routeParams.sharePermission as SharePermission | undefined;

        if (projectId) {
            this.projectService.subscribeAndSetProject(projectId);
        }
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(result => {
                this.currentStep = result?.configuration?.find(stepConfig => {
                    return stepConfig.step.isCurrentStep;
                });
            })
        );

        this.subscriptions.add(
            this.projectService.modesAvailable$.subscribe(val => {
                this.canConfigureProject = val.allowedProjectModes?.configure;
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
