import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project, StepConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
    private subscriptions = new Subscription();

    public project?: Project;
    public currentStep?: StepConfig;
    public isNewProject = false;

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.initCurrentStep();
        this.initProject();
        this.initRouteData();
    }

    private initCurrentStep() {
        this.subscriptions.add(
            this.projectService.currentStep$.subscribe(_currentStep => {
                if (_currentStep) {
                    this.currentStep = _currentStep;
                }
            })
        );
    }
    private initProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                this.project = _project;
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
    }

    // private setCurrentProjectStep(step: FieldConfig[] | null, index?: number) {
    // this.currentStepIndex = index ? index : 0;
    //     this.projectService.currentStep = step;
    // }

    public getCurrentProjectConfig() {
        console.log(this.projectService.projectConfig);
    }

    // private initProject(isNewProject: boolean) {
    //     this.projectConfigSubscription = this.projectService.projectConfig$.subscribe(projectConfig => {
    //         this.projectConfig = projectConfig;
    //     });

    //     if (isNewProject) {
    //         this.projectService.createNewProject(true);
    //     }
    // }
}
