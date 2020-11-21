import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project, StepConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'project-viewer',
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
        this.initProject();
        this.initRouteData();
    }

    private initProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                this.project = _project;
                this.currentStep = _project.configuration?.find(stepConfig => {
                    return stepConfig.step.isCurrentStep;
                });
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

    public getCurrentProjectConfig() {
        console.log(this.projectService.projectConfig);
    }
}
