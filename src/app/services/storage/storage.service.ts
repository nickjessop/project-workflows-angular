import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    public uploadFile(file: File) {
        const userId = this.authenticationService.user?.id;
        const storageRef = this.firebaseService.getStorageInstance().ref(`${userId}/${file.name}`);

        console.log(this.authenticationService.user);

        return from(storageRef.put(file));
    }

    public getDownloadUrl(filePath: string) {
        return this.firebaseService
            .getStorageInstance()
            .ref(filePath)
            .getDownloadURL();
    }
}
