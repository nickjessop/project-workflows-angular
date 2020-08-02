import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentMode } from 'src/app/models/interfaces/core-component';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
    private projectConfigSubscription = new Subscription();

    public projectConfig = this.projectService.createBaseProject();
    public isNewProject = false;
    public componentMode: ComponentMode = 'view';

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            const _project: Project = data.project;
            const _isNewProject: boolean = data.boolean;
            const _componentMode: ComponentMode = data.componentMode;

            this.projectConfig = _project;
            this.isNewProject = _isNewProject;
            this.componentMode = _componentMode;
        });
    }

    private initProject(isNewProject: boolean) {
        this.projectConfigSubscription = this.projectService.projectConfig$.subscribe(projectConfig => {
            this.projectConfig = projectConfig;
        });

        if (isNewProject) {
            this.projectService.createNewProject(true);
        }
    }

    private onFormSubmit($event: Event) {
        console.log(`Form submit event ${$event}`);
    }
}
