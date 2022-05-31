import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@stepflow/interfaces';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

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

    constructor(private authService: AuthenticationService, private messageService: MessageService) {}

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

    public onSaveProfileSelected() {
        if (!this.userDetails.profile) {
            return;
        }

        this.authService.updateProfileDetails(this.userDetails?.profile);
        this.displayProfileModal = false;
    }

    public async onProfileImageUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // const success = await this.authService.changeProfilePhoto($event.currentFiles[0]);
    }

    public onChangeEmailSelected(email?: string) {
        if (!email || this.authService.getCurrentUser()?.email === email) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Unable to send email reset. Please check your entered email.',
            });

            return;
        }

        this.authService.updateEmail(email);
    }

    public onChangePasswordSelected(password: string) {
        this.authService
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
