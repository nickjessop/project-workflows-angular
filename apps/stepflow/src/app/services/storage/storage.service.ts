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

    public uploadProjectFile(file: File, projectId: string) {
        const fileId: string = uuid();
        const pathId = projectId;
        const folder = 'projects';
        const storageRef = this.firebaseService.getStorageInstance().ref(`${folder}/${pathId}/${fileId}`);
        return from(storageRef.put(file));
    }

    public uploadProfileImage(file: File) {
        const fileId: string = uuid();
        const pathId = this.authenticationService.user?.id;
        const folder = 'users';
        const storageRef = this.firebaseService.getStorageInstance().ref(`${folder}/${pathId}/${fileId}`);
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
