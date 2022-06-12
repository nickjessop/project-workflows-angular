// import { Injectable } from '@angular/core';
// import { User } from '@stepflow/interfaces';
// import { MessageService } from 'primeng/api';
// import { map, switchMap } from 'rxjs/operators';
// import { AuthenticationService } from '../authentication/authentication.service';
// import { FirebaseService } from '../firebase/firebase.service';
// import { StorageService } from '../storage/storage.service';

// @Injectable({
//     providedIn: 'root',
// })
// export class UserService {
//     public userDetails: User = {};
//     public currentUser: any;

//     private readonly USERS_COLLECTION = 'users';

//     constructor(
//         private authService: AuthenticationService,
//         private storageService: StorageService,
//         private messageService: MessageService,
//         private firebaseService: FirebaseService
//     ) {
//         this.currentUser = this.authService.getCurrentUser();
//     }

//     public updateProfileDetails(userDetails: User) {
//         const photoURL = userDetails.photoURL || '/assets/placeholder/placeholder-profile.png';
//         const plan = userDetails.plan || '';
//         const photoFilePath = userDetails.photoFilePath || '';
//         const firstName = userDetails.firstName || '';
//         const lastName = userDetails.lastName || '';
//         const email = userDetails.email || '';
//         if (this.currentUser) {
//             this.currentUser
//                 .updateProfile({
//                     displayName: firstName + ' ' + lastName,
//                     photoURL: photoURL,
//                 })
//                 .then(
//                     () => {
//                         this.authService.setUserMetaData(photoFilePath, plan, firstName, lastName, email);
//                         this.messageService.add({
//                             severity: 'success',
//                             key: 'global-toast',
//                             life: 5000,
//                             closable: true,
//                             detail: 'Profile updated',
//                         });
//                     },
//                     (error: Error) => {
//                         this.messageService.add({
//                             severity: 'error',
//                             key: 'global-toast',
//                             life: 5000,
//                             closable: true,
//                             detail: 'Failed to update profile',
//                         });
//                     }
//                 );
//         }
//     }

//     public changeProfilePhoto(file: File) {
//         if (!file) {
//             return;
//         }
//         if (this.userDetails.photoFilePath) {
//             this.storageService.deleteFile(this.userDetails.photoFilePath);
//         }
//         this.storageService
//             .uploadProfileImage(file)
//             .pipe(
//                 switchMap(file => {
//                     return this.storageService.getDownloadUrl(file.metadata.fullPath).pipe(
//                         map(downloadUrl => {
//                             return {
//                                 downloadUrl: downloadUrl as string,
//                                 filePath: file.metadata.fullPath,
//                             };
//                         })
//                     );
//                 })
//             )
//             .subscribe(
//                 filedata => {
//                     this.userDetails.photoURL = filedata.downloadUrl;
//                     this.userDetails.photoFilePath = filedata.filePath;
//                 },
//                 error => {
//                     this.messageService.add({
//                         severity: 'error',
//                         key: 'global-toast',
//                         life: 5000,
//                         closable: true,
//                         detail: 'Failed to upload profile image',
//                     });
//                 }
//             );
//     }

//     public updateEmail(email: string, userProvidedPassword: string): Promise<any> {
//         // TODO: update email in user collection as well.. or switch to a different Auth provider?
//         return new Promise((resolve, reject) => {
//             const actionCodeSettings = {
//                 url: 'https://app.stepflow.co/profile',
//             };
//             if (this.currentUser) {
//                 this.authService
//                     .reAuthenticateUser(userProvidedPassword)
//                     .then(() => {
//                         this.currentUser
//                             .verifyBeforeUpdateEmail(email, actionCodeSettings)
//                             .then(() => {
//                                 this.messageService.add({
//                                     severity: 'success',
//                                     key: 'global-toast',
//                                     life: 5000,
//                                     closable: true,
//                                     detail: 'Verification email sent.',
//                                 });
//                                 resolve({ success: true });
//                             })
//                             .catch((error: Error) => {
//                                 this.messageService.add({
//                                     severity: 'error',
//                                     key: 'global-toast',
//                                     life: 5000,
//                                     closable: true,
//                                     detail: 'Failed to update email address.',
//                                 });
//                                 reject(error);
//                             });
//                     })
//                     .catch((error: Error) => {
//                         this.messageService.add({
//                             severity: 'error',
//                             key: 'global-toast',
//                             life: 5000,
//                             closable: true,
//                             detail: 'Incorrect password. Please try again.',
//                         });
//                     });
//             }
//         });
//     }

//     public updatePassword(userProvidedPassword: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             if (this.currentUser) {
//                 const email = this.currentUser.email;
//                 this.authService
//                     .reAuthenticateUser(userProvidedPassword)
//                     .then(() => {
//                         this.firebaseService
//                             .getAuthInstance()
//                             .sendPasswordResetEmail(email)
//                             .then(() => {
//                                 this.messageService.add({
//                                     severity: 'success',
//                                     key: 'global-toast',
//                                     life: 5000,
//                                     closable: true,
//                                     detail: 'Password reset email sent to ' + email,
//                                 });
//                                 resolve({ success: true });
//                             })
//                             .catch((error: Error) => {
//                                 this.messageService.add({
//                                     severity: 'error',
//                                     key: 'global-toast',
//                                     life: 5000,
//                                     closable: true,
//                                     detail: 'Unable to send password reset email at this time.',
//                                 });
//                                 reject(error);
//                                 console.log(error);
//                             });
//                     })
//                     .catch((error: Error) => {
//                         this.messageService.add({
//                             severity: 'error',
//                             key: 'global-toast',
//                             life: 5000,
//                             closable: true,
//                             detail: 'Incorrect password. Please try again.',
//                         });
//                         console.log(error);
//                     });
//             }
//         });
//     }

    
// }
