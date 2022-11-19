import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@stepflow/interfaces';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    public userDetails!: User;
    public displayProfileModal = false;
    public displayEmailModal = false;
    public displayPasswordModal = false;
    public passwordVerification = '';

    private subscriptions: Subscription = new Subscription();

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private messageService: MessageService
    ) {}

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    ngOnInit() {
        this.subscriptions.add(
            this.authService.$user.subscribe(_user => {
                if (!_user) {
                    return;
                }

                this.userDetails = _user;
            })
        );
    }

    showDialog(modal: string) {
        if (modal === 'profile') {
            this.displayProfileModal = true;
        } else if (modal === 'email') {
            this.displayEmailModal = true;
        } else if (modal === 'password') {
            this.displayPasswordModal = true;
        }
    }

    public async onSaveProfileSelected() {
        await this.userService.updateProfileDetails(this.userDetails);
        this.displayProfileModal = false;
    }

    public async onProfileImageUploadSelected($event: { files: File[] }, uploaderElement: any) {
        const success = await this.userService.changeProfilePhoto($event.files[0]);
        uploaderElement.clear();
        this.displayProfileModal = false;

        if (!success) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Failed to upload profile image.',
            });
        }
    }

    public async onChangeEmailSelected(password: string) {
        const currentEmail = this.authService.getCurrentUser()?.email;
        if (this.userDetails.email === currentEmail || !this.userDetails.email) {
            return;
        }

        const success = await this.userService.updateEmail(this.userDetails.email, password);

        if (!success) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Unable to send email reset. Please check your email and password and try again.',
            });
        }

        this.passwordVerification = '';
        this.displayEmailModal = false;
    }

    public onChangePasswordSelected(password: string) {
        this.userService
            .updatePassword(password)
            .then(() => {
                this.passwordVerification = '';
                this.displayPasswordModal = false;
            })
            .catch((error: Error) => {
                this.messageService.add({
                    severity: 'error',
                    key: 'global-toast',
                    life: 5000,
                    closable: true,
                    detail: 'Unable to send password reset email. Please check your password and try again.',
                });
            });
    }
}
