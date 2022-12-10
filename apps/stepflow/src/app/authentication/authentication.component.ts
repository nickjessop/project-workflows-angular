import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    public isLoading = false;

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
        this.isLoading = true;

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
            this.isLoading = false;
            return;
        }

        if (!password || !password2 || !firstName || !lastName || !plan) {
            message.detail = 'Please fill in password and name fields';
            this.messageService.add(message);
            this.isLoading = false;
            return;
        }

        const user = await this.authService.register(email, password, firstName, lastName, plan);

        if (user) {
            if (!user.emailVerified) {
                if (user.plan !== 'Essential') {
                    this.router.navigate(['/auth/confirmation?plan=' + user.plan]);
                } else {
                    this.router.navigate(['/auth/confirmation']);
                }
            } else {
                this.router.navigate(['/project']);
            }
        } else {
            message.detail = 'An error occurred while attempting to sign you up.';
            this.messageService.add(message);
        }
        this.isLoading = false;
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
