import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { of } from 'rxjs';
import { ProjectService } from './project.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolverService implements Resolve<string | undefined> {
    constructor(private projectService: ProjectService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.paramMap.get('id');

        return projectId ? of(projectId) : undefined;
    }
}
// export class ProjectResolverService implements Resolve<Observable<[ComponentMode, Project]>> {
//     constructor(private projectService: ProjectService) {}

//     resolve(route: ActivatedRouteSnapshot) {
//         const projectId = route.paramMap.get('id');

//         if (projectId) {
//             this.projectService.subscribeAndSetProject(projectId);

//             return of(combineLatest([this.projectService.projectMode$, this.projectService.projectConfig$]));
//         } else {
//             const defaultProject = this.projectService.createBaseProject('', '', '');
//             this.projectService.projectConfig = defaultProject;
//             this.projectService.projectMode = 'configure';

//             return of(combineLatest([this.projectService.projectMode$, this.projectService.projectConfig$]));
//         }
//     }
// }
