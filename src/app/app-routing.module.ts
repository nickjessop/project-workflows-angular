import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ConfirmationComponent } from './authentication/confirmation/confirmation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'auth/login', component: AuthenticationComponent },
    { path: 'auth/register', component: AuthenticationComponent },
    { path: 'auth/confirmation', component: ConfirmationComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
