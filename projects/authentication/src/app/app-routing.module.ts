import { NgModule } from '@angular/core';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { LoginComponent } from './authentication/login/login.component';

const appRoutes: Routes = [
    {
        path: 'auth',
        component: AuthenticationComponent,
        children: [
            { path: 'signup', component: SignUpComponent },
            { path: 'login', component: LoginComponent },
        ],
    },
    { path: '**', redirectTo: '/auth/login' },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
