import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProtectedGuard } from './protected.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'auth/login', component: AuthenticationComponent, canActivate: [ProtectedGuard] },
    { path: 'auth/register', component: AuthenticationComponent, canActivate: [ProtectedGuard] },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
