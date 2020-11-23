import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, from, Subject } from 'rxjs';
import { ComponentType, createFieldConfig, FieldConfig } from '../../models/interfaces/core-component';
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

    public unsubscribeToProjectListener?: () => void;

    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    public get projectConfig() {
        return this._projectConfig.getValue();
    }

    public set projectConfig(project: Project) {
        const projectCopy1 = _.cloneDeep(this.projectConfig);
        const projectCopy2 = _.cloneDeep(project);

        console.log(projectCopy1);
        console.log(projectCopy2);

        if (!_.isEqual(projectCopy1, projectCopy2)) {
            // this.updateProject(project);
            console.log('project changed');
        }
        this._projectConfig.next(project);
    }

    ngOnDestroy() {
        if (this.unsubscribeToProjectListener) {
            console.log('unsubscribing to project listener');
            this.unsubscribeToProjectListener();
        }
    }

    public createBaseProject(
        creatorId: string = this.authenticationService.user!.id,
        projectName = '',
        configuration?: StepConfig[]
    ) {
        const config = configuration
            ? configuration
            : [
                  {
                      components: [createFieldConfig()],
                      step: { title: '', icon: '', selected: true, isCurrentStep: true },
                  },
              ];

        const baseProject: Project = {
            name: projectName,
            description: 'Test dummy description',
            ownerIds: [creatorId],
            configuration: config,
        };

        return baseProject;
    }

    public swapBlockOrder(previousIndex: number, currentIndex: number) {
        // moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
        const currentStepIndex =
            this.projectConfig.configuration?.findIndex(config => {
                return config.step.isCurrentStep;
            }) || 0;

        moveItemInArray(this.projectConfig.configuration![currentStepIndex].components!, previousIndex, currentIndex);
        this.projectConfig = this.projectConfig;
    }

    public createNewProjectStep(
        stepTitle?: string,
        label?: string,
        name?: string,
        inputType?: string,
        options?: string[],
        collections?: string,
        type?: ComponentType,
        value?: string,
        stepDescription?: string
    ) {
        const fieldConfig = createFieldConfig(label, name, inputType, options, collections, type, value);
        const step = {
            step: { title: stepTitle || '(Untitled Step)', description: stepDescription || '' },
            components: [fieldConfig],
        };

        return step;
    }

    public createNewProject(saveAndGenerateProjectId = false) {
        const baseProject = this.createBaseProject(this.authenticationService.user!.id);

        if (!saveAndGenerateProjectId) {
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

    public deleteProject(projectId: string) {}

    public getAllProjectIds() {
        return from(
            this.firebaseService
                .getDbInstance()
                .collection(`${this.PROJECT_COLLECTION_NAME}`)
                .get()
        );
    }

    public addProjectBlock(projectBlock: FieldConfig) {
        const currentStepIndex = this.getCurrentStepIndex() || 0;
        this.projectConfig.configuration![currentStepIndex].components?.push(projectBlock);

        this.projectConfig = this.projectConfig;
    }

    public addProjectStep(newStep: StepConfig) {
        this.projectConfig.configuration?.push(newStep);
        this.setNewCurrentProjectStep(
            this.projectConfig.configuration ? this.projectConfig.configuration.length - 1 : 0
        );
    }

    private getCurrentStepIndex() {
        const currentStepIndex = this.projectConfig.configuration?.findIndex(config => {
            return config.step.isCurrentStep;
        });

        console.log(`current index: ${currentStepIndex}`);

        return currentStepIndex;
    }
    private resetCurrentProjectSteps() {
        this.projectConfig.configuration?.forEach(stepConfig => {
            if (stepConfig.step.isCurrentStep) {
                stepConfig.step.isCurrentStep = false;
            }
        });
    }

    public setNewCurrentProjectStep(stepIndex: number) {
        this.resetCurrentProjectSteps();

        if (this.projectConfig.configuration?.[stepIndex]) {
            this.projectConfig.configuration[stepIndex].step.isCurrentStep = true;
        } else {
            this.projectConfig.configuration![0].step.isCurrentStep = true;
        }

        this.projectConfig = this.projectConfig;
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

    public subscribeAndSetProject(projectId: string) {
        console.log(`Subscribing to project: ${projectId}`);

        this.unsubscribeToProjectListener = this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .doc(projectId)
            .onSnapshot(
                document => {
                    const project = document.data() as Project;
                    const currentStepSet = project.configuration?.some(stepConfig => {
                        return stepConfig.step.isCurrentStep;
                    });

                    if (!currentStepSet) {
                        if (project.configuration?.[0].step) {
                            project.configuration[0].step.isCurrentStep = true;
                        }
                    }

                    this.projectConfig = project;
                },
                error => {
                    console.log(error);
                }
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
