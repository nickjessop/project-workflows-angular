import { NgModule } from '@angular/core';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { LoginComponent } from './authentication/login/login.component';
import { ThankYouComponent } from './authentication/thank-you/thank-you.component';
import { ThankYouGuard } from './thank-you.guard';

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

const guardedRouted: Routes = [
    {
        path: 'thank-you',
        component: ThankYouComponent,
        canActivate: [ThankYouGuard],
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
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
