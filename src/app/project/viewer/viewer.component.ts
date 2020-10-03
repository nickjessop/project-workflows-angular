import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FieldConfig } from 'src/app/models/interfaces/core-component';
import { Project, Step } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
    private subscriptions = new Subscription();

    public project?: Project;
    public steps?: Step[];
    public currentStep?: FieldConfig[] | null;
    public isNewProject = false;
    // public currentStepIndex = 0;

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        const routeSub = this.route.data.subscribe(data => {
            this.isNewProject = data.data.isNewProject;
        });
        const currentStepSub = this.projectService.currentStep$.subscribe(_currentStep => {
            this.currentStep = _currentStep;
        });

        const projectSub = this.projectService.projectConfig$.subscribe(_project => {
            this.project = _project;
            this.steps = _project.configuration?.map(configs => {
                return configs.step;
            });
        });

        this.subscriptions.add(routeSub);
        this.subscriptions.add(currentStepSub);
        this.subscriptions.add(projectSub);
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
