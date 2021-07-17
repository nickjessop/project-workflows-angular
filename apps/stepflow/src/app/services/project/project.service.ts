import { moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockConfig, ComponentMode, createBlockConfig } from '../../core/interfaces/core-component';
import { Project, ProjectUsers, Role, Status, Step, StepConfig } from '../../models/interfaces/project';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private readonly PROJECT_COLLECTION_NAME = 'projects';
    private _projectConfig: BehaviorSubject<Project> = new BehaviorSubject<Project>(this.createBaseProject('', '', ''));
    public readonly projectConfig$ = this._projectConfig.asObservable();
    public isDragging: EventEmitter<boolean> = new EventEmitter();

    private _projectMode: BehaviorSubject<ComponentMode> = new BehaviorSubject<ComponentMode>('view');
    public readonly projectMode$ = this._projectMode.asObservable();

    // private _currentStepConfig: BehaviorSubject<StepConfig | undefined> = new BehaviorSubject<StepConfig | undefined>(
    //     this._projectConfig.value.configuration?.[0]
    // );
    // public readonly currentStepConfig$ = this._currentStepConfig.asObservable();

    public unsubscribeToProjectListener?: () => void;

    constructor(
        private firebaseService: FirebaseService,
        private authenticationService: AuthenticationService,
        private router: Router
    ) {}

    public get projectConfig() {
        return this._projectConfig.getValue();
    }

    public set projectConfig(project: Project) {
        this._projectConfig.next(project);
    }

    public get projectMode() {
        return this._projectMode.getValue();
    }

    public set projectMode(mode: ComponentMode) {
        this._projectMode.next(mode);
    }
    private async setProject(project: Project, persistChange = true) {
        const projectCopy1 = _.cloneDeep(this.projectConfig);
        const projectCopy2 = _.cloneDeep(project);

        if (persistChange) {
            const didProjectChange = this.areProjectsDifferent(projectCopy1, projectCopy2);
            if (didProjectChange) {
                const updateResult = await this.updateProject(project);
                return updateResult;
            } else {
                return true;
            }
        } else {
            this.projectConfig = project;

            return true;
        }
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

        const project1RolesLen = project1.memberRoles?.length || 0;
        const project2RolesLen = project2.memberRoles?.length || 0;

        if (project1Len !== project2Len || project1RolesLen !== project2RolesLen) {
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

        for (let i = 0; i < (project1.memberRoles || []).length; i++) {
            const roles1 = project1.memberRoles?.[i];
            const roles2 = project2.memberRoles?.[i];

            if (!roles2 || !roles1) {
                return true;
            }

            if (JSON.stringify(roles1) !== JSON.stringify(roles2)) {
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

    public syncProject() {
        this.projectConfig = _.cloneDeep(this.projectConfig);
        this.updateProject(this.projectConfig);
    }

    public createBaseProject(userId: string, projectName: string, description: string, configuration?: StepConfig[]) {
        const config: StepConfig[] = configuration
            ? configuration
            : [
                  {
                      components: [createBlockConfig('textInput')],
                      step: {
                          title: 'Untitled Step',
                          description: 'Untitled Step Description',
                          status: { label: 'No status', value: 'no-status', icon: '' },
                          isCurrentStep: true,
                      },
                  },
              ];

        const baseProject: Project = {
            name: projectName,
            description,
            memberRoles: [{ userId, role: 'owner' }],
            members: [userId],
            pendingMembers: [],
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

    public setBlockDrag(dragging: boolean) {
        this.isDragging.emit(dragging);
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
        const fieldConfig = createBlockConfig('textInput', label, name);

        const stepConfig: StepConfig = {
            step: {
                title: stepTitle || 'Untitled Step',
                description: stepDescription || '',
                status: status || { label: 'No status', value: 'no-status', icon: '' },
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

    public createNewProject(projectName: string, projectDescription: string) {
        const userId = this.authenticationService.user?.id;

        const baseProject = this.createBaseProject(userId || '', projectName, projectDescription);

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

    public async getProjectUserDetails(projectMemberRoles: Project['memberRoles']) {
        const memberIds = projectMemberRoles.map(member => {
            return member.userId;
        });
        const projectMembersDetails = await this.authenticationService.getUserGroupMetaData(memberIds);

        const memberList: ProjectUsers[] | undefined = projectMembersDetails?.map(projectMember => {
            const found = projectMemberRoles.find(_member => {
                return _member.userId === projectMember.id;
            });

            return { ...projectMember, ...found };
        });

        return memberList;
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

        this.setProject(_projectConfig, false);
    }

    public getProjects() {
        const userId = this.authenticationService.user?.id || '';

        const ref = this.firebaseService.getDbInstance().collection(this.PROJECT_COLLECTION_NAME);

        return from(ref.where('members', 'array-contains', userId).get()).pipe(
            // return from(ref.where('members', 'array-contains', { userId: userId, role: 'owner' }).get()).pipe(
            map(data => {
                const projects = data.docs.map(items => {
                    return items.data();
                });

                return projects;
            })
        );
    }

    public async updateProjectRoles(projectRoles: { userId: string; role: Role }[]) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.memberRoles = projectRoles;

        const setResult = await this.setProject(_projectConfig);
        return setResult;
    }

    public subscribeAndSetProject(projectId: string) {
        // this.firebaseService.getDbInstance()!.collection(this.PROJECT_COLLECTION_NAME).doc(projectId).onSnapshot()
        this.unsubscribeToProjectListener = this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION_NAME)
            .doc(projectId)
            .onSnapshot(
                document => {
                    const project = document.data() as Project;

                    if (!project) {
                        this.router.navigate(['404']);
                    }

                    if (
                        project.memberRoles.some(member => {
                            return (
                                member.userId === this.authenticationService.user?.id &&
                                ['viewer'].includes(member.role)
                            );
                        })
                    ) {
                        this._projectMode.next('view');
                    } else if (
                        project.memberRoles.some(member => {
                            return (
                                member.userId === this.authenticationService.user?.id && ['owner'].includes(member.role)
                            );
                        })
                    ) {
                        this._projectMode.next('configure');
                        // this._projectMode.next('edit');
                    } else {
                        this._projectMode.next('edit');
                    }

                    console.log('project mode', this._projectMode.getValue());

                    const currentStepSet = project.configuration?.some(stepConfig => {
                        return stepConfig.step.isCurrentStep;
                    });

                    if (!currentStepSet) {
                        if (project.configuration?.[0]?.step) {
                            project.configuration[0].step.isCurrentStep = true;
                        }
                    }

                    this.projectConfig = project;
                },
                error => {
                    console.log(error);
                    this.router.navigate(['404']);
                }
            );
    }

    public async sendProjectInvitations(emails: string[], role: Role) {
        const addMemberResult = await this.addNewProjectMembers(emails, role);
        if (addMemberResult === false) {
            return undefined;
        }
        const callable = this.firebaseService.getFunctionsInstance().httpsCallable('invitationEmail');
        return callable({
            emails: emails,
            subject: `${this.projectConfig?.name} - Invitation to collaborate`,
            projectName: `${this.projectConfig?.name}`,
            projectSender: `${this.authenticationService.getCurrentUser()?.displayName}`,
            projectRole: `${role}`,
            fromEmail:
                this.authenticationService.getCurrentUser()?.email ||
                this.authenticationService.getCurrentUser()?.displayName ||
                '',
            projectLink: `https://app.stepflow.co/project/${this.projectConfig.id}`,
        }).then(
            (response: { data: { success: boolean } }) => {
                console.log(response);
                return response;
            },
            (error: Error) => {
                return undefined;
            }
        );
    }

    public async addNewProjectMembers(emails: string[], role: Role) {
        return this.authenticationService
            .findUsersMatchingEmail(emails)
            .then(async users => {
                const _projectConfig = _.cloneDeep(this.projectConfig);
                const newMembers: { userId: string; role: Role }[] = [];
                const pendingMembers: { email: string; role: Role }[] = [];
                users?.newMembers.map(member => {
                    return newMembers.push({ userId: member, role: role || 'viewer' });
                });
                users?.pendingMembers.map(member => {
                    return pendingMembers.push({ email: member, role: role || 'viewer' });
                });
                if (users?.newMembers) {
                    _projectConfig.members = _.union(_projectConfig.members, users.newMembers);
                    _projectConfig.memberRoles = _.union(_projectConfig.memberRoles, newMembers);
                }
                if (_projectConfig.pendingMembers && users?.pendingMembers) {
                    _projectConfig.pendingMembers = _.union(_projectConfig.pendingMembers, users.pendingMembers);
                }
                const setResult = await this.setProject(_projectConfig);
                return setResult;
            })
            .catch(function(error: Error) {
                // TODO handle error
                return false;
            });
    }

    public checkPendingMembers() {
        if (this.projectConfig.pendingMembers) {
            // TODO
        }
    }

    private isReadOnlyRole(projectMemberRoles: { userId: string; role: Role }[]) {}

    public resetProject() {
        this.projectConfig = this.createBaseProject('', '', '');
    }
}
