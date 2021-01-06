import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    // public authMode: 'register' | 'login' = 'login';
    public authMode: 'register' | 'login' = 'register';
    public authInfo = { email: '', password: '', password2: '', name: '', plan: '' };

    public email: string | null = '';
    public plan: string | null = 'Essential';
    public planPrice: string | null = '$9';

    constructor(private authService: AuthenticationService) {}

    ngOnInit(): void {
        const queryString = window.location.search;
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            this.email = urlParams.get('email');
            if (this.email) {
                this.authInfo.email = this.email;
            }
            this.plan = urlParams.get('plan');
            if (this.plan) {
                this.authInfo.plan = this.plan;
            } else {
                this.authInfo.plan = 'Essential';
            }
            this.planPrice = urlParams.get('planPrice');
        }
    }

    public register() {
        const email = this.authInfo.email;
        const password = this.authInfo.password;
        const password2 = this.authInfo.password2;
        const name = this.authInfo.name;
        const plan = this.authInfo.plan;
        this.authService.register(email, password, password2, name, plan);
    }

    public login() {
        const email = this.authInfo.email;
        const password = this.authInfo.password;

        if (!email || !password) {
            return;
        }

        this.authService.login(email, password);
    }
}
