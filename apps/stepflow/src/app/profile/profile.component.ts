import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService, User } from '../services/authentication/authentication.service';
import { StorageService } from '../services/storage/storage.service';

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

    constructor(
        private authService: AuthenticationService,
        private storageService: StorageService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.userDetails = this.authService.user!;
        console.log(this.userDetails);
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

    updateProfileDetails() {
        const currentUser = this.authService.getCurrentUser();
        const photoURL = this.userDetails.photoURL || '';
        const plan = this.userDetails.plan || '';
        const photoFilePath = this.userDetails.photoFilePath || '';
        const firstName = this.userDetails.firstName || '';
        const lastName = this.userDetails.lastName || '';
        if (currentUser) {
            currentUser
                .updateProfile({
                    displayName: firstName + ' ' + lastName,
                    photoURL: photoURL,
                })
                .then(
                    () => {
                        this.userDetails.displayName = currentUser.displayName || '';
                        this.userDetails.photoURL =
                            currentUser.photoURL || '/assets/placeholder/placeholder-profile.png';
                        this.authService.setUserMetaData(photoFilePath, plan, firstName, lastName);
                        this.displayProfileModal = false;
                        this.messageService.add({
                            severity: 'success',
                            key: 'global-toast',
                            life: 3000,
                            closable: true,
                            detail: 'Profile updated',
                        });
                    },
                    err => {
                        this.messageService.add({
                            severity: 'error',
                            key: 'global-toast',
                            life: 3000,
                            closable: true,
                            detail: 'Failed to update profile',
                        });
                    }
                );
        }
    }

    onProfileImageUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        this.changeFile($event.currentFiles[0]);
    }

    private changeFile(file: File) {
        if (!file) {
            return;
        }
        if (this.userDetails.photoFilePath) {
            this.storageService.deleteFile(this.userDetails.photoFilePath);
        }
        this.storageService
            .uploadProfileImage(file)
            .pipe(
                switchMap(file => {
                    return this.storageService.getDownloadUrl(file.metadata.fullPath).pipe(
                        map(downloadUrl => {
                            return {
                                downloadUrl: downloadUrl as string,
                                filePath: file.metadata.fullPath,
                            };
                        })
                    );
                })
            )
            .subscribe(
                filedata => {
                    this.userDetails.photoURL = filedata.downloadUrl;
                    this.userDetails.photoFilePath = filedata.filePath;
                },
                err => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 3000,
                        closable: true,
                        detail: 'Failed to upload profile image',
                    });
                }
            );
    }

    updateEmailAddress() {}
}
