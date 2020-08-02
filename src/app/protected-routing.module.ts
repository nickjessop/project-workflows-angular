import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProtectedGuard } from './protected.guard';
import { ProjectComponent } from './project/project.component';
import { ProjectResolverService } from './services/project/project-resolver.service';
import { ComponentPlaygroundComponent } from './dashboard/component-playground/component-playground.component';
import { ViewerComponent } from './project/viewer/viewer.component';

const guardedRoutes: Routes = [
    {
        path: 'dashboard/playground',
        component: ComponentPlaygroundComponent,
        // canActivate: [ProtectedGuard],
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        // canActivate: [ProtectedGuard],
    },
    {
        path: 'project',
        component: ProjectComponent,
        canActivate: [ProtectedGuard],
    },
    {
        path: 'project/:id',
        component: ViewerComponent,
        canActivate: [ProtectedGuard],
        resolve: { project: ProjectResolverService },
    },
];

@NgModule({
    imports: [RouterModule.forChild(guardedRoutes)],
    exports: [RouterModule],
})
export class ProtectedRoutingModule {}
