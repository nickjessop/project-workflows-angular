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

        // this.projectService.
        this.subscriptions.add(
            combineLatest([this.projectService.projectConfig$, this.projectService.projectMode$]).subscribe(result => {
                if (result[0]) {
                    this.project = result[0];
                    this.currentStep = this.project.configuration?.find(stepConfig => {
                        return stepConfig.step.isCurrentStep;
                    });
                }
                if (result[1]) {
                    this.componentMode = result[1];
                }
            })
        );

        // this.subscriptions.add(
        //     this.projectService.projectConfig$.subscribe(_project => {
        //         if (_project) {
        //             this.project = _project;
        //             this.currentStep = _project.configuration?.find(stepConfig => {
        //                 return stepConfig.step.isCurrentStep;
        //             });
        //         }
        //     })
        // );

        // Here we set the mode of the project, we can go further and set individual modes per component
        // this.componentMode = this.projectService.projectMode;

        // this.subscriptions.add(
        //     this.projectService.projectMode$.subscribe(componentMode => {
        //         if (componentMode) {
        //             this.componentMode = componentMode;
        //         }
        //     })
        // );
    }
    // private initRouteData() {
    //     this.subscriptions.add(
    //         this.route.data.subscribe(data => {
    //             const proj: Observable<[ComponentMode, Project]> = data.data;

    //             proj.subscribe(info => {
    //                 if (info[1]) {
    //                     this.project = info[1];
    //                     this.currentStep = this.project?.configuration?.find(stepConfig => {
    //                         return stepConfig.step.isCurrentStep;
    //                     });
    //                 }
    //                 if (info[0]) {
    //                     this.componentMode = info[0];
    //                     console.log(info[0]);
    //                 }
    //             });
    //         })

    //         // this.route.data.subscribe(data => {
    //         //     this.isNewProject = data.data.isNewProject;
    //         // })
    //     );
    // }

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
