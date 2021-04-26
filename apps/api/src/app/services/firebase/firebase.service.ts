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
}
