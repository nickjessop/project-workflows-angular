import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentPlaygroundComponent } from './dashboard/component-playground/component-playground.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { ViewerComponent } from './project/viewer/viewer.component';
import { ProtectedGuard } from './protected.guard';
import { ProjectResolverService } from './services/project/project-resolver.service';

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
        resolve: { data: ProjectResolverService },
    },
];

@NgModule({
    imports: [RouterModule.forChild(guardedRoutes)],
    exports: [RouterModule],
})
export class ProtectedRoutingModule {}
