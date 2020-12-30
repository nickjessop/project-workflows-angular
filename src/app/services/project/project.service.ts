import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, from, Subject } from 'rxjs';
import { BlockConfig, createBlockConfig } from '../../core/interfaces/core-component';
import { Project, Status, Step, StepConfig } from '../../models/interfaces/project';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private readonly PROJECT_COLLECTION_NAME = 'projects';
    private _projectConfig: BehaviorSubject<Project> = new BehaviorSubject<Project>(this.createBaseProject());
    public readonly projectConfig$ = this._projectConfig.asObservable();

    // private _currentStepConfig: BehaviorSubject<StepConfig | undefined> = new BehaviorSubject<StepConfig | undefined>(
    //     this._projectConfig.value.configuration?.[0]
    // );
    // public readonly currentStepConfig$ = this._currentStepConfig.asObservable();

    public unsubscribeToProjectListener?: () => void;

    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    public get projectConfig() {
        return this._projectConfig.getValue();
    }

    public set projectConfig(project: Project) {
        this._projectConfig.next(project);
    }

    private setProject(project: Project) {
        const projectCopy1 = _.cloneDeep(this.projectConfig);
        const projectCopy2 = _.cloneDeep(project);

        const didProjectChange = this.areProjectsDifferent(projectCopy1, projectCopy2);

        if (didProjectChange) {
            this.updateProject(project);
        }

        this.projectConfig = project;
    }

    private areProjectsDifferent(project1: Project, project2: Project) {
        // Drop values we shouldn't save or compare
        project1.configuration?.forEach(config => {
            config.step.isCurrentStep = false;
        });
        project2.configuration?.forEach(config => {
            config.step.isCurrentStep = false;
        });
        // Did the number of steps change?
        // Did the number of blocks change?
        // Did the steps or blocks get modified?

        const project1Len = project1.configuration?.length || 0;
        const project2Len = project2.configuration?.length || 0;

        if (project1Len !== project2Len) {
            return true;
        }

        for (let i = 0; i < (project1.configuration || []).length; i++) {
            const components1 = project1.configuration?.[i].components;
            const components2 = project2.configuration?.[i].components;

            const step1 = project1.configuration?.[i].step;
            const step2 = project2.configuration?.[i].step;

            if (!components2 || !components1) {
                return true;
            }

            if (components2.length !== components2.length) {
                return true;
            }

            if (JSON.stringify(components1) !== JSON.stringify(components2)) {
                return true;
            }
            if (JSON.stringify(step1) !== JSON.stringify(step2)) {
                return true;
            }
        }

        return false;
    }

    ngOnDestroy() {
        if (this.unsubscribeToProjectListener) {
            this.unsubscribeToProjectListener();
        }
    }

    public createBaseProject(
        creatorId: string = this.authenticationService.user!.id,
        projectName = '',
        description = '',
        configuration?: StepConfig[]
    ) {
        const config: StepConfig[] = configuration
            ? configuration
            : [
                  {
                      components: [createBlockConfig('smallTextInput')],
                      step: {
                          title: 'Untitled Step',
                          description: 'Untitled Step Description',
                          isCurrentStep: true,
                      },
                  },
              ];

        const baseProject: Project = {
            name: projectName,
            description,
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

        const _projectConfig = _.cloneDeep(this.projectConfig);

        moveItemInArray(_projectConfig.configuration![currentStepIndex].components!, previousIndex, currentIndex);
        // this.projectConfig = _projectConfig;
        this.setProject(_projectConfig);
    }

    public swapStepOrder(previousIndex: number, currentIndex: number) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        moveItemInArray(_projectConfig.configuration!, previousIndex, currentIndex);
        this.setProject(_projectConfig);
    }

    public createNewProjectStep(
        stepTitle?: string,
        stepDescription?: string,
        status?: Status,
        label?: string,
        name?: string
    ) {
        const fieldConfig = createBlockConfig('smallTextInput', label, name);

        const stepConfig: StepConfig = {
            step: {
                title: stepTitle || 'Untitled Step',
                description: stepDescription || '',
                status: status || undefined,
            },
            components: [fieldConfig],
        };

        return stepConfig;
    }

    public updateProjectStep(step: Step) {
        const currentStepIndex = this.getCurrentStepIndex() || 0;
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.configuration![currentStepIndex].step = step;

        this.setProject(_projectConfig);
    }

    public createNewProject(projectName?: string, projectDescription?: string) {
        const baseProject = this.createBaseProject(
            this.authenticationService.user!.id,
            projectName,
            projectDescription
        );

        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .add(baseProject)
            .then(
                documentRef => {
                    baseProject.id = documentRef.id;
                    documentRef.update({ id: documentRef.id });
                    // this.projectConfig = baseProject;
                    return baseProject;
                },
                error => {
                    console.log(`Error occurred while creating a new project: ${error}`);
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

    public deleteProject(projectId: string) {
        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .doc(projectId)
            .delete()
            .then(
                success => {
                    return true;
                },
                error => {
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

    public addProjectBlock(projectBlock: BlockConfig) {
        const currentStepIndex = this.getCurrentStepIndex() || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.configuration![currentStepIndex].components?.push(projectBlock);

        // this.projectConfig = _projectConfig;
        this.setProject(_projectConfig);
    }

    public addProjectStep(newStep: StepConfig) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.configuration?.push(newStep);

        this.setNewCurrentProjectStep(
            _projectConfig.configuration ? _projectConfig.configuration.length - 1 : 0,
            _projectConfig
        );
    }

    public deleteProjectBlock(blockIndex: number) {
        console.log(`Deleting block at index: ${blockIndex}`);
        const currentStepIndex = this.getCurrentStepIndex() || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.configuration![currentStepIndex].components!.splice(blockIndex, 1);

        this.setProject(_projectConfig);
    }

    public deleteCurrentProjectStep() {
        const currentStepIndex = this.getCurrentStepIndex() || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.configuration?.splice(currentStepIndex, 1);

        this.setProject(_projectConfig);
    }

    private getCurrentStepIndex() {
        const currentStepIndex = this.projectConfig.configuration?.findIndex(config => {
            return config.step.isCurrentStep;
        });

        return currentStepIndex;
    }

    public getCurrentStep() {
        const index = this.getCurrentStepIndex() || 0;

        return this.projectConfig.configuration![index].step;
    }

    private resetCurrentProjectSteps(projectConfig: Project) {
        const _projectConfig = _.cloneDeep(projectConfig);
        _projectConfig.configuration?.forEach(stepConfig => {
            if (stepConfig.step.isCurrentStep) {
                stepConfig.step.isCurrentStep = false;
            }
        });

        return _projectConfig;
    }

    public setNewCurrentProjectStep(stepIndex: number, projectConfig?: Project) {
        const _projectConfig = projectConfig
            ? this.resetCurrentProjectSteps(projectConfig)
            : this.resetCurrentProjectSteps(_.cloneDeep(this.projectConfig));

        if (_projectConfig.configuration?.[stepIndex]) {
            _projectConfig.configuration[stepIndex].step.isCurrentStep = true;
        } else {
            _projectConfig.configuration![0].step.isCurrentStep = true;
        }

        this.setProject(_projectConfig);
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
}
