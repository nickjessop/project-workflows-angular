import { Injectable } from '@angular/core';
import { User, USER_COLLECTION_NAME } from '@stepflow/interfaces';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private authService: AuthenticationService,
        private storageService: StorageService,
        private firebaseService: FirebaseService
    ) {}

    // Update current users first or last name, or their profile photo
    public async updateProfileDetails(userDetails: User) {
        const photoURL = userDetails.photoURL || '/assets/placeholder/placeholder-profile.png';
        const photoFilePath = userDetails.photoFilePath || '';
        const firstName = userDetails.firstName || '';
        const lastName = userDetails.lastName || '';
        const email = userDetails.email || '';

        const currentUser = this.authService.user;

        if (currentUser == null) {
            return;
        }

        // Update the Firebase auth user's profile
        // await currentUser
        //     .updateProfile({
        //         displayName: `${firstName} ${lastName}`,
        //         photoURL,
        //     })
        //     .catch(err => {
        //         this.messageService.add({
        //             severity: 'error',
        //             key: 'global-toast',
        //             life: 5000,
        //             closable: true,
        //             detail: 'Failed to update profile',
        //         });
        //     });

        // Update our custom user's collection with new metadata
        // const success = await this.updateUserMetaData({ photoFilePath, firstName, lastName, email });

        return true;
    }

    public async changeProfilePhoto(file?: File) {
        if (!file) {
            return;
        }

        const currentUser = this.authService.user;
        if (!currentUser) {
            return;
        }

        try {
            const currentFilePath = currentUser.photoFilePath;
            if (currentFilePath) {
                await this.storageService.deleteFile(currentFilePath).catch(e => {
                    console.error(`changeProfilePhoto() - Failed to delete file. ${currentFilePath}`);
                });
            }

            const filesnapshot = await this.storageService.uploadProfileImage(file, currentUser.id!);

            if (!filesnapshot) {
                throw new Error(`Failed to upload profile image`);
            }
            const downloadUrl = await this.storageService.getDownloadUrl(filesnapshot.metadata.fullPath);
            const filePath = filesnapshot.metadata.fullPath;

            const firebaseUser = this.authService.getCurrentUser();
            await firebaseUser!.updateProfile({ photoURL: downloadUrl });

            const success = await this.authService.updateUserMetaData({ photoFilePath: filePath });

            this.user = { ...this.user, ...success, photoURL: downloadUrl };

            return success;
        } catch (e) {
            return false;
        }
    }

    public updateEmail(email: string, userProvidedPassword: string): Promise<any> {
        // TODO: update email in user collection as well.. or switch to a different Auth provider?
        return new Promise((resolve, reject) => {
            const actionCodeSettings = {
                url: 'https://app.stepflow.co/profile',
            };

            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                this.authService
                    .reAuthenticateUser(userProvidedPassword)
                    .then(() => {
                        currentUser
                            .verifyBeforeUpdateEmail(email, actionCodeSettings)
                            .then(() => {
                                resolve({ success: true });
                            })
                            .catch((error: Error) => {
                                reject(error);
                            });
                    })
                    .catch((error: Error) => {
                        return false;
                    });
            }
        });
    }

    public updatePassword(userProvidedPassword: string) {
        return new Promise((resolve, reject) => {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                const email = currentUser.email;

                if (!email || email === null) {
                    return;
                }

                this.authService
                    .reAuthenticateUser(userProvidedPassword)
                    .then(() => {
                        this.firebaseService.auth
                            .sendPasswordResetEmail(email)
                            .then(() => {
                                resolve({ success: true });
                            })
                            .catch((error: Error) => {
                                reject(error);
                            });
                    })
                    .catch((error: Error) => {
                        return false;
                    });
            }
        });
    }

    public async getUsers(userIds: string[]) {
        userIds = userIds.filter((value, index, self) => self.indexOf(value) === index);
        const users = await this.getUser(userIds);
        return users;
    }

    public async getUser(userIds: string[]) {
        return this.firebaseService.db
            .collection(USER_COLLECTION_NAME)
            .where(this.firebaseService.fieldPathId, 'in', userIds)
            .get()
            .then(
                querySnapshot => {
                    const userData: Map<string, User> = new Map();
                    querySnapshot.docs.forEach(doc => {
                        const user = doc.data() as User;
                        userData.set(doc.id, user);
                    });
                    return userData;
                },
                error => {
                    console.log(error);
                    return null;
                }
            );
    }
}
