import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProtectedGuard } from './protected.guard';
import { EditComponent } from './project/edit/edit.component';
import { ViewComponent } from './project/view/view.component';
import { ProjectComponent } from './project/project.component';
import { ProjectService } from './services/project/project.service';
import { ProjectResolverService } from './services/project/project-resolver.service';
import { ComponentPlaygroundComponent } from './dashboard/component-playground/component-playground.component';

const guardedRoutes: Routes = [
    {
        path: 'dashboard/playground',
        component: ComponentPlaygroundComponent,
        canActivate: [ProtectedGuard],
        children: [
            // {
            //     path: '',
            //     children: [
            //         { path: 'edit', component: EditComponent },
            //         { path: 'view', component: ViewComponent },
            //     ],
            // },
        ],
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [ProtectedGuard],
        children: [
            // {
            //     path: '',
            //     children: [
            //         { path: 'edit', component: EditComponent },
            //         { path: 'view', component: ViewComponent },
            //     ],
            // },
        ],
    },
    {
        path: 'project',
        component: ProjectComponent,
        canActivate: [ProtectedGuard],
        children: [
            {
                path: '',
                children: [
                    {
                        path: 'edit/:id',
                        component: EditComponent,
                        resolve: { project: ProjectResolverService },
                    },
                    { path: 'view/:id', component: ViewComponent },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(guardedRoutes)],
    exports: [RouterModule],
})
export class ProtectedRoutingModule {}
