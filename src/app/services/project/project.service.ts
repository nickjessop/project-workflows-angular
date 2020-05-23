import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { createFieldConfigDefault, FieldConfig } from '../../models/interfaces/core-component';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Project } from '../../models/interfaces/project';
import { combineAll } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private readonly PROJECT_COLLECTION_NAME = 'projects';
    private _projectConfig: BehaviorSubject<Project> = new BehaviorSubject<Project>(this.createBaseProject());
    public readonly projectConfig$: Observable<Project> = this._projectConfig.asObservable();

    // private _allProjectsForUser$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>()
    // public readonly allProjectsForUser$: Observable<Project[]>;

    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    public get projectConfig() {
        return this._projectConfig.getValue();
    }

    public set projectConfig(projectConfig) {
        this._projectConfig.next(projectConfig);
    }

    public createBaseProject(
        creatorId: string = this.authenticationService.user!.id,
        projectName = '',
        configuration?: FieldConfig[]
    ) {
        const baseProject: Project = {
            name: projectName,
            ownerIds: [creatorId],
            configuration: configuration || [createFieldConfigDefault()],
        };

        return baseProject;
    }

    //Call this on creating a new project, `shouldPersistAndGenerateId` indicates whether we should pre-generate and pre-persist the project
    public createNewProject(shouldPersistAndGenerateId = false) {
        const baseProject = this.createBaseProject(this.authenticationService.user!.id);

        if (!shouldPersistAndGenerateId) {
            this.projectConfig = baseProject;
        }

        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .add(baseProject)
            .then(
                documentRef => {
                    baseProject.id = documentRef.id;
                    this.projectConfig = baseProject;

                    return baseProject;
                },
                error => {
                    console.log(`Error while saving project to generate id: ${error}`);

                    this.projectConfig = baseProject;

                    return baseProject;
                }
            );

        //TODO: Return the project itself rather than setting it within this service, for the component to pick up
    }

    //TODO: Add firebase rule to check that users are authorized to edit this project
    public updateProject(projectConfig: Project) {
        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .doc(projectConfig.id)
            .set(projectConfig, { merge: true })
            .then(
                () => {
                    console.log(`Successfully updated project`);
                    return true;
                },
                error => {
                    console.log(`An error occurred while updating project: ${error}`);
                    return false;
                }
            );
    }

    //TODO: Add firebase rule to only return authorized projects
    public getProjects(userId: string) {
        const creatorsProjects$ = new Subject();
        const membersProjects$ = new Subject();

        const creatorProjectsRef = this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .where('creatorId', '==', userId);

        const memberProjectsRef = this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .where('memberIds', 'array-contains', userId);

        creatorProjectsRef.onSnapshot(creatorsProjectsSnapshot => {
            const data = creatorsProjectsSnapshot.docs.map(d => d.data());
            return creatorsProjects$.next(data);
        });

        memberProjectsRef.onSnapshot(membersProjectsSnapshot => {
            const data = membersProjectsSnapshot.docs.map(d => d.data());
            return membersProjects$.next(data);
        });

        const allProjectsForUser$ = combineLatest(creatorsProjects$, membersProjects$).pipe(values => {
            return values;
        });

        return allProjectsForUser$;
    }

    public getProject(projectId: string) {
        console.log(`get project called with id: ${projectId}`);
        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .doc(projectId)
            .get()
            .then(
                project => {
                    console.log('fetched project: ', project.data());

                    return project.data() as Project;
                },
                error => {
                    console.log(`Error while fetching project: ${projectId}`, error);
                    return null;
                }
            );
    }

    public saveDemoProject() {
        const defaultConfig: FieldConfig[] = [
            {
                type: 'smallTextInput',
                label: 'Title',
                inputType: 'text',
                name: '',
                value: 'TTC Management System',
            },
            {
                type: 'largeTextInput',
                label: 'Introduction Summary',
                inputType: 'text',
                name: '',
                value:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
                    'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
                    'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
                    'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
                    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
            },
            {
                type: 'smallTextInput',
                label: 'Cost Summary',
                inputType: 'text',
                name: '',
                value: 'Additional $56,656 cost for travel allowance around GTA.',
            },
        ];
        const projectConfig: Project = this.createBaseProject(
            this.authenticationService.user!.id,
            'Testing Project',
            defaultConfig
        );

        const project = this.createNewProject(true).then(newProject => {
            projectConfig.id = newProject.id;
            this.updateProject(projectConfig);
        });
    }
}
