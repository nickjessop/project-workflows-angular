import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
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
