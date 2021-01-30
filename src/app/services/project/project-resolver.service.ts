import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { of } from 'rxjs';
import { ProjectService } from './project.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolverService implements Resolve<{ isNewProject: boolean } | null> {
    constructor(private projectService: ProjectService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.paramMap.get('id');

        if (projectId) {
            this.projectService.subscribeAndSetProject(projectId);

            return of({ isNewProject: false });
        } else {
            const defaultProject = this.projectService.createBaseProject('', '', '');
            this.projectService.projectConfig = defaultProject;

            return of({ isNewProject: true });
        }
    }
}
