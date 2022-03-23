import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentMode, Project, SharePermission, StepConfig } from '@stepflow/interfaces';
import { combineLatest, Subscription } from 'rxjs';
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

        this.subscriptions.add(
            combineLatest([this.projectService.projectConfig$, this.projectService.projectMode$]).subscribe(result => {
                this.currentStep = result[0]?.configuration?.find(stepConfig => {
                    return stepConfig.step.isCurrentStep;
                });

                this.project = result[0];
                this.componentMode = result[1];
                if (this.componentMode == 'configure') {
                    this.canConfigureProject = true;
                }
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
