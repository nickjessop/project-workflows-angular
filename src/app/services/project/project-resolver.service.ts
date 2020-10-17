import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ProjectService } from './project.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolverService implements Resolve<{ isNewProject: boolean } | null> {
    constructor(private projectService: ProjectService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.paramMap.get('id');

        if (projectId) {
            return this.projectService.getProject(projectId).pipe(
                mergeMap(project => {
                    if (!project) {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }

                    this.projectService.projectConfig = project;
                    this.projectService.currentStep = project.configuration?.[0] ? project.configuration[0] : null;

                    return of({ isNewProject: false });
                })
            );
        } else {
            const defaultProject = this.projectService.createBaseProject();
            this.projectService.projectConfig = defaultProject;
            this.projectService.currentStep = defaultProject.configuration?.[0]
                ? defaultProject.configuration[0]
                : null;

            return of({ isNewProject: true });
        }
    }
}
