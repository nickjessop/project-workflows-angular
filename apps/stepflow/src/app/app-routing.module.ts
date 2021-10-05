import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ConfirmationComponent } from './authentication/confirmation/confirmation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ViewerComponent } from './project/viewer/viewer.component';
import { RedirectGuard } from './redirect.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: '/project', pathMatch: 'full' },
    { path: 'project/:userId/:projectId/:sharePermission', data: { isSharedLink: true }, component: ViewerComponent },
    {
        path: 'auth/login',
        component: AuthenticationComponent,
        data: { authMode: 'login' },
        canActivate: [RedirectGuard],
    },
    {
        path: 'auth/register',
        component: AuthenticationComponent,
        data: { authMode: 'register' },
        canActivate: [RedirectGuard],
    },
    { path: 'auth/confirmation', component: ConfirmationComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
