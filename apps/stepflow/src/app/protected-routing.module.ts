import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProjectComponent } from './project/project.component';
import { ViewerComponent } from './project/viewer/viewer.component';
import { ProtectedGuard } from './protected.guard';
import { ProjectResolverService } from './services/project/project-resolver.service';

const guardedRoutes: Routes = [
    {
        path: 'project',
        component: ProjectComponent,
        canActivate: [ProtectedGuard],
    },
    {
        path: 'project/:id',
        component: ViewerComponent,
        canActivate: [ProtectedGuard],
        resolve: { data: ProjectResolverService },
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ProtectedGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(guardedRoutes)],
    exports: [RouterModule],
})
export class ProtectedRoutingModule {}
