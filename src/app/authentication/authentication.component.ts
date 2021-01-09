import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    public authInfo = { email: '', password: '', password2: '', name: '', plan: '' };

    public href: string = '';
    public email: string = '';
    public plan: string = 'Essential';
    public planPrice: string = '$9';

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.href = this.router.url;
        this.activatedRoute.queryParams.subscribe(params => {
            if (!isEmpty(params)) {
                this.email = params['email'];
                this.plan = params['plan'];
                this.planPrice = params['planPrice'];
                this.authInfo.email = this.email;
            }
        });
        this.authInfo.plan = this.plan;
    }

    public register() {
        const { email, password, password2, name, plan } = this.authInfo;

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
