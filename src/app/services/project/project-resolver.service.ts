import { Injectable } from '@angular/core';
import { Project } from '../../models/interfaces/project';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, from, Observable, of } from 'rxjs';
import { ProjectService } from './project.service';
import { mergeMap, take } from 'rxjs/operators';
import { ComponentMode } from 'src/app/models/interfaces/core-component';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolverService
    implements Resolve<{ project: Project; isNewProject: boolean; componentMode: ComponentMode } | null> {
    constructor(private projectService: ProjectService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const projectId = route.paramMap.get('id') || '';
        const isNewProject = false;
        const componentMode: ComponentMode = 'edit';

        return from(this.projectService.getProject(projectId)).pipe(
            take(1),
            mergeMap(project => {
                if (project) {
                    return of({
                        project,
                        isNewProject,
                        componentMode,
                    });
                } else {
                    this.router.navigate(['404']);
                    return EMPTY;
                }
            })
        );
    }
}
