import { Injectable } from '@angular/core';
import { Project } from '../../models/interfaces/project';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, from, Observable, of } from 'rxjs';
import { ProjectService } from './project.service';
import { mergeMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolverService implements Resolve<Project | null> {
    constructor(private projectService: ProjectService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const projectId = route.paramMap.get('id') || '';

        /* return this.cs.getCrisis(id).pipe(
            take(1),
            mergeMap(crisis => {
                if (crisis) {
                    return of(crisis);
                } else { // id not found
                    this.router.navigate(['/crisis-center']);
                    return EMPTY;
                }
            })
        );*/

        return from(this.projectService.getProject(projectId)).pipe(
            take(1),
            mergeMap(project => {
                if (project) {
                    return of(project);
                } else {
                    this.router.navigate(['404']);
                    return EMPTY;
                }
            })
        );
    }
}
