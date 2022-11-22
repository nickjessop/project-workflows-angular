import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { unlinkSync, writeFileSync } from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FirebaseService {
    private serviceAccount = require('../../secrets/stepflow-d6a02-firebase-adminsdk-bdo05-40361fcfec.json');

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: 'https://stepflow-d6a02.firebaseio.com',
            storageBucket: 'stepflow-d6a02.appspot.com',
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

    public async createUser(firstName: string, lastName: string, password: string, email: string) {
        const user = await admin
            .auth()
            .createUser({ email, emailVerified: false, password, displayName: `${firstName} ${lastName}` });

        return user;
    }

    public async deleteUserPhoto(oldPhotoFilePath?: string) {
        if (!oldPhotoFilePath) {
            return;
        }

        return admin
            .storage()
            .bucket()
            .file(oldPhotoFilePath)
            .delete();
    }

    public async uploadUserPhoto(userId: string, userPhoto?: FormData) {
        if (!userPhoto) {
            return;
        }

        const fileId = uuid();
        const tmpPath = `/tmp/${fileId}`;
        const ref = `users/${userId}/profile.jpg`;

        writeFileSync(tmpPath, userPhoto);

        await admin
            .storage()
            .bucket(ref)
            .upload(tmpPath);

        unlinkSync(tmpPath);

        /*

    public uploadProfileImage(file: File, userId: string) {
        const fileId: string = uuid();
        const pathId = userId;
        const folder = 'users';
        const storageRef = this.firebaseService.storage.ref(`${folder}/${pathId}/${fileId}`);
        return storageRef.put(file);
    }
        */
    }
}
