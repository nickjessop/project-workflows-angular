import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Subject } from 'rxjs';
import { createFieldConfigDefault, FieldConfig } from '../../models/interfaces/core-component';
import { Project, StepConfig } from '../../models/interfaces/project';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private readonly PROJECT_COLLECTION_NAME = 'projects';
    private _projectConfig: BehaviorSubject<Project> = new BehaviorSubject<Project>(this.createBaseProject());
    public readonly projectConfig$ = this._projectConfig.asObservable();

    private _currentStep: BehaviorSubject<StepConfig | null> = new BehaviorSubject<StepConfig | null>(null);
    public readonly currentStep$ = this._currentStep.asObservable();

    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    public get projectConfig() {
        return this._projectConfig.getValue();
    }

    public set projectConfig(projectConfig: Project) {
        this._projectConfig.next(projectConfig);
    }

    public get currentStep() {
        return this._currentStep.getValue();
    }

    public set currentStep(currentStep: StepConfig | null) {
        this._currentStep.next(currentStep);
    }

    public createBaseProject(
        creatorId: string = this.authenticationService.user!.id,
        projectName = '',
        configuration?: StepConfig[]
    ) {
        const config = configuration
            ? configuration
            : [{ components: [createFieldConfigDefault()], step: { title: '', icon: '', selected: true } }];

        const baseProject: Project = {
            name: projectName,
            description: 'Test dummy description',
            ownerIds: [creatorId],
            configuration: config,
        };

        return baseProject;
    }

    public createNewProjectStep() {
        const fieldConfig = createFieldConfigDefault();
        const step = { step: { title: '(Untitled Step)' }, components: [fieldConfig] };

        return step;
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

    public getAllProjectIds() {
        return from(
            this.firebaseService
                .getDbInstance()
                .collection(`${this.PROJECT_COLLECTION_NAME}`)
                .get()
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

        return from(
            this.firebaseService
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
                )
        );
    }

    public saveDemoProject() {
        const demoConfig = this.generateDemoProjectConfig();
        const demoConfigs = [demoConfig, demoConfig, demoConfig, demoConfig];

        const projectConfig: Project = this.createBaseProject(
            this.authenticationService.user!.id,
            'Testing Project',
            demoConfigs
        );

        const project = this.createNewProject(true).then(newProject => {
            projectConfig.id = newProject.id;
            this.updateProject(projectConfig);
        });
    }

    private generateDemoProjectConfig() {
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

        const projectConfig = {
            components: defaultConfig,
            step: { title: 'Insert title here', icon: '', selected: true },
        };

        return projectConfig;
    }
}
