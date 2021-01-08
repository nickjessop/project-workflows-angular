import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'auth/login', component: AuthenticationComponent },
    { path: 'auth/register', component: AuthenticationComponent },
    // { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
