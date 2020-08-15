import { Component, OnInit, Input } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { Project, ProjectConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentMode, FieldConfig } from 'src/app/models/interfaces/core-component';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
    private projectConfigSubscription = new Subscription();

    public projectConfig?: ProjectConfig[];
    public currentStep: FieldConfig[] = [];

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            const project = data.project;

            this.initProject(project);

            this.projectService.projectConfig = project;

            // this.projectConfig = _project;
            // this.isNewProject = _isNewProject;
            this.initProject(data.project);
        });
    }

    private initProject(project: { project?: Project; isNewProject?: boolean; componentMode?: ComponentMode }) {
        const _project = project.project ? project.project : null;
        const _isNewProject = project.isNewProject as boolean;

        this.currentStep = _project && _project.configuration?.length ? _project.configuration[0].components : [];

        if (!_project) {
            // of(this.projectService.createNewProject()).pipe(take(1)).subscribe((newProject) => {
            //     this.projectService.projectConfig = newProject;
            // });
        } else {
            this.projectService.projectConfig = _project;
        }
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
