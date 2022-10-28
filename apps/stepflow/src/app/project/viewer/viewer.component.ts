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
    private subscriptions: Array<Subscription> = [];

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
        const projectId = routeParams.projectId as string | undefined;
        const userId = routeParams.userId as string | undefined;
        const sharePermission = routeParams.sharePermission as SharePermission | undefined;

        if (userId && projectId && sharePermission) {
            this.projectService.subscribeAndSetProject(projectId, 'view');
        } else if (projectId) {
            this.projectService.subscribeAndSetProject(projectId);
        }

        this.subscriptions.push(
            this.projectService.projectConfig$.subscribe(result => {
                this.currentStep = result?.configuration?.find(stepConfig => {
                    return stepConfig.step.isCurrentStep;
                });
            })
        );

        this.subscriptions.push(
            this.projectService.modesAvailable$.subscribe(val => {
                if (val.allowedProjectModes.configure === true) {
                    this.canConfigureProject = true;
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.projectService.resetProject();
    }

    public onDragAndDropEvent(event: any) {
        this.projectService.swapBlockOrder(event.previousIndex, event.currentIndex);
    }

    public onDragAndDropStepEvent(event: any) {
        this.projectService.swapStepOrder(event.previousIndex, event.currentIndex);
    }
}
