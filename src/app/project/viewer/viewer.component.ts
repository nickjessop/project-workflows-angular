import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
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

    public projectConfig$?: Observable<Project>;
    public currentStep$?: Observable<FieldConfig[] | null>;

    public project?: Project;

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

        if (!_project) {
            // of(this.projectService.createNewProject()).pipe(take(1)).subscribe((newProject) => {
            //     this.projectService.projectConfig = newProject;
            // });
        } else {
            this.setProjectConfig(_project);
            this.currentStep$ = this.projectService.currentStep$;

            if (_project.configuration?.length) {
                this.setCurrentProjectStep(_project.configuration[0].components);
            }
            this.projectConfig$ = this.projectService.projectConfig$;

            this.project = _project;
        }
    }

    private setProjectConfig(project: Project) {
        this.projectService.projectConfig = project;
    }

    private setCurrentProjectStep(step: FieldConfig[] | null) {
        this.projectService.currentStep = step;
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
