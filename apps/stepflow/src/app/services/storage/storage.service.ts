import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ProjectService } from '../project/project.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(
        private firebaseService: FirebaseService,
        private authenticationService: AuthenticationService,
        private projectService: ProjectService
    ) {}

    public uploadFile(file: File) {
        const fileId: string = uuid();
        let pathId = this.authenticationService.user?.id;
        let folder = 'users';
        if (this.projectService.projectConfig.id != undefined) {
            pathId = this.projectService.projectConfig.id;
            folder = 'projects';
        }
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
