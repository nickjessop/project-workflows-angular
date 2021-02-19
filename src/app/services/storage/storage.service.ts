import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    public uploadFile(file: File) {
        const fileId: string = uuid();
        console.log(file);
        const userId = this.authenticationService.user?.id;
        const storageRef = this.firebaseService.getStorageInstance().ref(`${userId}/${fileId}`);

        return from(storageRef.put(file));
    }

    public getDownloadUrl(filePath: string) {
        return from(
            this.firebaseService
                .getStorageInstance()
                .ref(filePath)
                .getDownloadURL()
        );
    }

    public deleteFile(filePath: string) {
        return from(
            this.firebaseService
                .getStorageInstance()
                .ref(filePath)
                .delete()
        );
    }
}
