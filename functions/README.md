# Functions

Currently this project is in use and replaces some of the chaining of async code that would normally occur on the frontend. Eventually the plan is to move away from functions and instead use the API project.
<br />
<br />

## Current Cloud Functions

---

<br/>

### invitationEmail

This function is used during project invite on the frontend, to send out an email via SendGrid service.

<br/>

### updateUserMetadata

This function is used to sync changes between the [Firebase User](https://console.firebase.google.com/u/2/project/stepflow-d6a02/authentication/users) and our [User collection](https://console.firebase.google.com/u/2/project/stepflow-d6a02/firestore/data/~2Fusers~2F06T4lgj7x1emjUEMCmPnJYPFjum2)

<br/>

### createUserAndAttachMetadata

This function is similar to updateUserMetadata but instead is used during the user sign up process.
It creates a [Firebase User](https://console.firebase.google.com/u/2/project/stepflow-d6a02/authentication/users), and then augments its data on our [User collection](https://console.firebase.google.com/u/2/project/stepflow-d6a02/firestore/data/~2Fusers~2F06T4lgj7x1emjUEMCmPnJYPFjum2)

<br/>

### updateProjectStorageUsageOnDeletion

Because our project enforces user storage quotas, we storage the total number of bytes stored on a [projectStorageUsage collection](https://console.firebase.google.com/u/2/project/stepflow-d6a02/firestore/data/~2FprojectStorageUsage~2F06T4lgj7x1emjUEMCmPnJYPFjum2).

This function subscribes to [storage changes](https://console.firebase.google.com/u/2/project/stepflow-d6a02/storage/stepflow-d6a02.appspot.com/files) that occurres. Upon storage deletes, it looks up the project collection and reduces the storage bytes it used.

<br/>

### updateProjectStorageUsageOnAddition

Because our project enforces user storage quotas, we storage the total number of bytes stored on a [projectStorageUsage collection](https://console.firebase.google.com/u/2/project/stepflow-d6a02/firestore/data/~2FprojectStorageUsage~2F06T4lgj7x1emjUEMCmPnJYPFjum2).

This function subscribes to [storage changes](https://console.firebase.google.com/u/2/project/stepflow-d6a02/storage/stepflow-d6a02.appspot.com/files) that occurres. It calculates size of the image/file and then adds it to the current amount of space used for a project.

<br/>
