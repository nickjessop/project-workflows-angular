import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthenticationComponent } from './authentication/authentication.component';

const routes: Routes = [
    {
        path: 'auth',
        component: AuthenticationComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: SignupComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
