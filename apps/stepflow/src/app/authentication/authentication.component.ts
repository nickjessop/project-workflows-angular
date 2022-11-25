import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { allowedUserIds, UserPlan } from '@stepflow/interfaces';
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
        private messageService: MessageService,
        private router: Router,
        @Inject(DOCUMENT) private document: Document
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

    public async register() {
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
            message.detail = 'Please fill in password and name fields';
            this.messageService.add(message);

            return;
        }

        const success = await this.authService.register(email, password, firstName, lastName, plan);
        if (success) {
            if (!allowedUserIds.includes(success?.id || '')) {
                this.authService.logout(false);
            }

            if (plan !== 'Essential') {
                this.router.navigate(['/auth/confirmation?plan=' + plan]);
            } else {
                this.router.navigate(['/auth/confirmation']);
            }
        }
    }

    public async login() {
        const email = this.authInfo.email;
        const password = this.authInfo.password;

        if (!email || !password) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Please enter an email and password.',
            });
            return;
        }

        const firebaseUser = await this.authService.login(email, password);

        const { user } = firebaseUser;

        if (user == null) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Invalid email or password.',
            });
        }

        if (user && !allowedUserIds.includes(user?.uid)) {
            this.authService.logout(true);

            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Sorry, you may not login at this time.',
            });

            return;
        }

        const parsedUser = {
            id: user!.uid,
            email: user!.email || undefined,
            emailVerified: user!.emailVerified,
        };

        this.authService.user = parsedUser;
        this.router.navigate(['project']);
    }

    goToHomepage(): void {
        this.document.location.href = 'https://stepflow.co';
    }
}
