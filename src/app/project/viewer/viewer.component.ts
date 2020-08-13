import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project, ProjectConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentMode, FieldConfig } from 'src/app/models/interfaces/core-component';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
    private projectConfigSubscription = new Subscription();

    public projectConfig?: ProjectConfig[];
    public isNewProject = false;
    public componentMode: ComponentMode = 'view';
    public currentStep: FieldConfig[] = [];

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            const { project } = data;
            const _project: ProjectConfig[] = project.project;
            const _isNewProject: boolean = project.isNewProject;
            const _componentMode: ComponentMode = project.componentMode;

            this.projectConfig = _project;
            this.isNewProject = _isNewProject;
            this.componentMode = _componentMode;
            this.currentStep = _project[0] ? _project[0].components : [];
            this.initProject(data.project);
        });
    }

    private initProject(project: any) {
        // this.projectService.projectConfig = project.project;

        this.currentStep = project.project.configuration ? project.project.configuration[0].components : [];
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
