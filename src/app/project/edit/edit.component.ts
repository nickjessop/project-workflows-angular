import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../models/interfaces/project';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
    @Input() isNewProject = true;

    private projectConfigSubscription: Subscription = new Subscription();
    private projectConfig: Project = this.projectService.createBaseProject();
    private routeSubscription: Subscription = new Subscription();

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.projectConfig = data.project;
        });
        // this.initProject(this.isNewProject);
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
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
