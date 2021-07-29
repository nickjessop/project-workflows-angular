import { Component, OnInit } from '@angular/core';
import { User } from '@stepflow/interfaces';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    public userDetails: User = {};
    public displayProfileModal: boolean = false;
    public displayEmailModal: boolean = false;
    public displayPasswordModal: boolean = false;
    public passwordVerification: string = '';

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.userDetails = this.authService.user!;
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
        this.userService.updateProfileDetails(this.userDetails);
        this.displayProfileModal = false;
    }

    public onProfileImageUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        this.userService.changeProfilePhoto($event.currentFiles[0]);
    }

    public onChangeEmailSelected(password: string) {
        const currentEmail = this.authService.getCurrentUser()?.email;
        if (this.userDetails.email && this.userDetails.email != currentEmail) {
            this.userService
                .updateEmail(this.userDetails.email, password)
                .then(() => {
                    this.passwordVerification = '';
                    this.displayEmailModal = false;
                })
                .catch((error: Error) => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 5000,
                        closable: true,
                        detail: 'Unable to send email reset. Please check your email and password and try again.',
                    });
                });
        } else {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Incorrect password or email. Please try again.',
            });
        }
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
