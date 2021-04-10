import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService, User } from '../authentication/authentication.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public userDetails: User = {};
    public currentUser: any;

    constructor(
        private authService: AuthenticationService,
        private storageService: StorageService,
        private messageService: MessageService
    ) {
        this.currentUser = this.authService.getCurrentUser();
    }

    public updateProfileDetails(userDetails: User) {
        const photoURL = userDetails.photoURL || '/assets/placeholder/placeholder-profile.png';
        const plan = userDetails.plan || '';
        const photoFilePath = userDetails.photoFilePath || '';
        const firstName = userDetails.firstName || '';
        const lastName = userDetails.lastName || '';
        if (this.currentUser) {
            this.currentUser
                .updateProfile({
                    displayName: firstName + ' ' + lastName,
                    photoURL: photoURL,
                })
                .then(
                    () => {
                        this.authService.setUserMetaData(photoFilePath, plan, firstName, lastName);
                        this.messageService.add({
                            severity: 'success',
                            key: 'global-toast',
                            life: 3000,
                            closable: true,
                            detail: 'Profile updated',
                        });
                    },
                    (error: Error) => {
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

    public changeProfilePhoto(file: File) {
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
                error => {
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

    public updateEmail(email: string, password: string) {
        console.log('hello!');
        var actionCodeSettings = {
            url: 'https://app.stepflow.co/profile',
        };
        if (this.currentUser) {
            this.authService
                .reAuthenticateUser(password)
                .then(() => {
                    this.currentUser
                        .verifyBeforeUpdateEmail(email, actionCodeSettings)
                        .then(() => {
                            this.messageService.add({
                                severity: 'success',
                                key: 'global-toast',
                                life: 3000,
                                closable: true,
                                detail: 'Verification email sent.',
                            });
                        })
                        .catch((error: Error) => {
                            this.messageService.add({
                                severity: 'error',
                                key: 'global-toast',
                                life: 3000,
                                closable: true,
                                detail: 'Failed to update email address.',
                            });
                            console.log(error);
                        });
                    // this.currentUser
                    //     .updateEmail(email)
                    //     .then(() => {
                    //         this.messageService.add({
                    //             severity: 'success',
                    //             key: 'global-toast',
                    //             life: 3000,
                    //             closable: true,
                    //             detail: 'Email address updated.',
                    //         });
                    //         this.currentUser.emailVerified = false;
                    //         console.log(this.currentUser);
                    //         this.currentUser.sendEmailVerification();
                    //     })
                    //     .catch((error: Error) => {
                    //         this.messageService.add({
                    //             severity: 'error',
                    //             key: 'global-toast',
                    //             life: 3000,
                    //             closable: true,
                    //             detail: 'Failed to update email address.',
                    //         });
                    //         console.log(error);
                    //     });
                })
                .catch(error => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 5000,
                        closable: true,
                        detail: 'Incorrect password. Please try again.',
                    });
                    console.log(error);
                });
        }
    }

    public updatePassword(email: string, password: string) {
        //
    }
}
