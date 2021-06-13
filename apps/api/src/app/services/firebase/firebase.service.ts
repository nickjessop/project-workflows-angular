import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private serviceAccount = require('../../secrets/stepflow-d6a02-firebase-adminsdk-bdo05-40361fcfec.json');

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

    public async updateUser(user: { id: string; email: string; firstName: string; lastName: string; plan?: UserPlan }) {
        // const updatedUser = await admin
        //     .auth()
        //     .updateUser(user.id, { email: user.email, displayName: `${user.firstName} ${user.lastName}` });

        const _updatedUser = await admin
            .firestore()
            .collection('users')
            .doc(user.id)
            .update({ firstName: user.firstName, lastName: user.lastName, email: user.email, plan: user.plan });

        return _updatedUser;
    }
}

export type UserPlan = 'Plus' | 'Growth' | 'Essential' | 'Free';
