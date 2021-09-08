import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private serviceAccount = require('../../secrets/stepflow-d6a02-firebase-adminsdk-bdo05-40361fcfec.json');

    public USER_COLLECTION = 'users';
    public PROJECTS_COLLECTION = 'projects';
    public INVITATION_COLLECTION = 'invitations';

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: 'https://stepflow-d6a02.firebaseio.com',
        });
    }

    public async fetchUid(idToken?: string) {
        if (!idToken) {
            return;
        }

        try {
            const token = await admin.auth().verifyIdToken(idToken);

            return token.uid;
        } catch (err) {
            return;
        }
    }

    public test() {
        /*
 const firebaseAuth = this.firebaseService.getAuthInstance();
        return firebaseAuth.setPersistence('local').then(() => {
            firebaseAuth
                .createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const { user } = userCredential;
                    const parsedUser = {
                        id: user!.uid,
                        email: user!.email || undefined,
                        emailVerified: user!.emailVerified,
                    };
                    this.user = parsedUser;
                    this.checkForExistingProjects(this.user.id || '');
                    const updateUserMetadata = this.firebaseService
                        .getFunctionsInstance()
                        .httpsCallable('updateUserMetadata');
                    // .httpsCallable('updateUserMetadata', {});

                    return from(updateUserMetadata({ firstName, lastName, plan, email }));
                })
                .then(() => {
                    this.getCurrentUser()!.updateProfile({
                        displayName: firstName + ' ' + lastName,
                    });
                });
        });
    */
    }

    public async createUser(firstName: string, lastName: string, password: string, email: string) {
        const user = await admin
            .auth()
            .createUser({ email, emailVerified: false, password, displayName: `${firstName} ${lastName}` });

        return user;
    }

    private checkForExistingInvites() {
        // admin.firestore().collection(this.INVITATION_COLLECTION).where('email', '==').get()
    }
}
