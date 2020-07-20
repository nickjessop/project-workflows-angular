// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const UserCountBuffer = 53;
const MaxUserPagination = 10;

export async function totalUsers() {
    let count = 0;

    const countedUsers = await countUsers();
    count += countedUsers.userCount;

    return count;
}

function countUsers(nextPageToken?: any) {
    const val = admin
        .auth()
        .listUsers(MaxUserPagination, nextPageToken)
        .then(userResults => {
            console.log(userResults.users[0].metadata);
            return {
                userCount: userResults.users.length,
                token: userResults.pageToken,
            };
        });

    return val;
}

exports.userTotal = functions.https.onRequest(async (req, res) => {
    const users = await totalUsers();

    const count = users + UserCountBuffer;

    res.send({ userTotal: `${count}` });
});
