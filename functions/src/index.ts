// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

const USER_DOCUMENT_PATH = 'user' as const;

exports.updateUserMetadata = functions.https.onCall(
    (data: { name?: string; plan?: 'Plus' | 'Growth' | 'Essential' | 'Free' }, context) => {
        const uid = context.auth?.uid;

        if (!uid) {
            throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
        }

        admin
            .firestore()
            .collection(USER_DOCUMENT_PATH)
            .doc(uid)
            .set({ name: data.name, plan: data.plan }, { merge: true })
            .then(
                success => {
                    return {};
                },
                err => {
                    throw new functions.https.HttpsError('internal', 'An error occurred while updating user');
                }
            );
    }
);
