import { Injectable } from '@angular/core';
import { User, UserDTO, USER_COLLECTION_NAME } from '@stepflow/interfaces';
import { ApiService } from '../api/api.service';

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
        private firebaseService: FirebaseService,
        private apiService: ApiService
    ) {}

    // Update current users first or last name, or their profile photo
    public async updateProfileDetails(userDetails: User, profileIcon?: File) {
        const userDTO: UserDTO = userDetails;
        const formData = new FormData();

        Object.entries(userDTO).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (profileIcon) {
            formData.append('photo', profileIcon, profileIcon.name);
        }

        const update = await this.apiService.put('user', formData);

        return update;
    }

    public async changeProfilePhoto(file?: File) {
        if (!file) {
            return;
        }

        const currentUser = this.authService.user;
        if (!currentUser) {
            return;
        }

        const formData = new FormData();
        formData.append('photo', file, file.name);

        const update = await this.apiService.put('user', formData);

        return update;
    }

    public async updateEmail(email: string, userProvidedPassword: string) {
        const actionCodeSettings = {
            url: 'https://app.stepflow.co/profile',
        };
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return false;
        }

        const reauthSuccess = await this.authService.reAuthenticateUser(userProvidedPassword);

        if (!reauthSuccess) {
            return false;
        }

        return currentUser
            .verifyBeforeUpdateEmail(email, actionCodeSettings)
            .catch(e => {
                return false;
            })
            .then(success => {
                return success;
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
