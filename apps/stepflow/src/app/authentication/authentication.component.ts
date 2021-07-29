import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserPlan } from '@stepflow/interfaces';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    public authInfo: {
        firstName?: string;
        lastName?: string;
        plan?: UserPlan;
        password: string;
        password2?: string;
        planPrice?: string;
        email: string;
    } = {
        email: '',
        password: '',
        password2: '',
        firstName: '',
        lastName: '',
        plan: 'Essential',
        planPrice: '9',
    };

    public authMode: 'register' | 'login' = 'login';

    private subscriptions = new Subscription();

    constructor(
        private authService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.activatedRoute.data.subscribe(data => {
                const { authMode } = data;
                this.authMode = authMode;
            })
        );

        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe(params => {
                this.authInfo.email = params['email'] || '';
                this.authInfo.plan = params['plan'] || 'Essential';
                this.authInfo.planPrice = params['planPrice'] || '9';
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public register() {
        const { firstName, lastName, plan, password, password2, email } = this.authInfo;

        const message = {
            severity: 'error',
            key: 'global-toast',
            life: 2000,
            closable: true,
            detail: '',
        };

        if (password !== password2) {
            message.detail = 'Passwords do not match';
            this.messageService.add(message);

            return;
        }

        if (!password || !password2 || !firstName || !lastName || !plan) {
            message.detail = 'Please fill in password, name and plan fields';
            this.messageService.add(message);

            return;
        }

        this.authService.register(email, password, firstName, lastName, plan);
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
