import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private firebaseService: FirebaseService) {}

    public uploadProjectFile(file: File, projectId: string) {
        const fileId: string = uuid();
        const pathId = projectId;
        const folder = 'projects';
        const storageRef = this.firebaseService.storage.ref(`${folder}/${pathId}/${fileId}`);
        return storageRef.put(file);
    }

    public uploadProfileImage(file: File, userId: string) {
        const pathId = userId;
        const folder = 'users';
        const storageRef = this.firebaseService.storage.ref(`${folder}/${pathId}/profile.png`);
        return storageRef.put(file);
    }

    public getDownloadUrl(filePath: string): Promise<string> {
        return this.firebaseService.storage.ref(filePath).getDownloadURL();
    }

    public deleteFile(filePath: string) {
        return this.firebaseService.storage.ref(filePath).delete();
    }
}
