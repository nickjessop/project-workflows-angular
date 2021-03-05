import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
    id?: string;
    email?: string;
    emailVerified?: boolean;
    name?: string;
    profileImage?: string;
    plan?: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public userDetails: User = { id: '', name: '', email: '', emailVerified: false, profileImage: '', plan: '' };

    private user = this.authenticationService.getCurrentUser();
    private userId = this.authenticationService.user?.id;
    private userEmail = this.user?.email!;
    private userEmailVerified = this.user?.emailVerified;
    private userDisplayName = this.user?.displayName || this.userEmail;
    private userPhotoURL = this.user?.photoURL || '';

    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    private userRef = this.firebaseService
        .getDbInstance()
        .collection('users')
        .doc(this.userId);

    async getUserDetails() {
        this.userDetails = {
            id: this.userId,
            name: this.userDisplayName,
            email: this.userEmail,
            emailVerified: this.userEmailVerified,
            profileImage: this.userPhotoURL,
        };
        try {
            const doc = await this.userRef.get();
            if (doc.exists) {
                const userPlan = doc.data()?.Plan;
                this.userDetails.plan = userPlan;
            } else {
                console.log('No such user!');
            }
        } catch (err) {
            console.log('Error getting user info:', err);
        }
    }

    // updateUserProfileImage(file: File) {
    //     this.userRef
    //         .set({
    //             profileImage: 'profile.png',
    //         })
    //         .then(() => {
    //             console.log('Document successfully written!');
    //         })
    //         .catch((err: any) => {
    //             console.error('Error writing document: ', err);
    //         });
    // }
}
