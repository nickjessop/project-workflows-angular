import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project/project.service';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
    constructor(private projectService: ProjectService, private authenticationService: AuthenticationService) {}

    ngOnInit() {}

    public saveProject() {
        console.log('saving project test');

        this.projectService.saveDemoProject();
    }

    public updateProject() {
        console.log('updating project test');
    }

    public getProjects() {
        const { id } = this.authenticationService.user!;

        console.log(`getting projects for user ${id}`);
        // this.projectService.getProjects(`${id}`);
    }
}
