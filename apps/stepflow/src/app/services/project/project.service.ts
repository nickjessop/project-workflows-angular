import { moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    BlockConfig,
    ComponentMode,
    Project,
    ProjectUsers,
    Role,
    ShareLink,
    SharePermission,
    Status,
    Step,
    StepConfig,
} from '@stepflow/interfaces';
import * as _ from 'lodash';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreComponentService } from '../../core/core-component.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private readonly PROJECT_COLLECTION = 'projects';
    private readonly INVITATION_COLLECTION = 'projects';
    private readonly SHARE_COLLECTION = 'shareLinks';
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
        private coreComponentService: CoreComponentService,
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

        if (project1.name || project1.description !== project2.name || project2.description) {
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

    public createBaseProject(userId: string, projectName: string, description?: string, configuration?: StepConfig[]) {
        const config: StepConfig[] = configuration
            ? configuration
            : [
                  {
                      components: [this.coreComponentService.createBlockConfig('richTextInput')],
                      step: {
                          title: 'Untitled step',
                          description: 'Untitled step description',
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
        const fieldConfig = this.coreComponentService.createBlockConfig('richTextInput', label, name);

        const stepConfig: StepConfig = {
            step: {
                title: stepTitle || 'Untitled step',
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

    public createNewProject(projectName: string, projectDescription?: string) {
        const userId = this.authenticationService.user?.id;

        const baseProject = this.createBaseProject(userId || '', projectName, projectDescription);

        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION)
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
    public updateProject(projectConfig: Project, shouldMerge = true) {
        return this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION)
            .doc(projectConfig.id)
            .set(projectConfig, { merge: shouldMerge })
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
            .collection(this.PROJECT_COLLECTION)
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
                .collection(`${this.PROJECT_COLLECTION}`)
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

    public async updateProjectSettings(projectSettings: { name: string; description: string }) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.name = projectSettings.name;
        _projectConfig.description = projectSettings.description;
        const setResult = await this.setProject(_projectConfig);
        return setResult;
    }

    public addProjectStep(newStep: StepConfig) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.configuration?.push(newStep);

        this.setNewCurrentProjectStep(
            _projectConfig.configuration ? _projectConfig.configuration.length - 1 : 0,
            _projectConfig
        );

        this.setProject(_projectConfig);
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

    public async getProjects() {
        const userId = this.authenticationService.user?.id || '';

        const ref = this.firebaseService.getDbInstance().collection(this.PROJECT_COLLECTION);

        const projects = await ref.where('members', 'array-contains', userId).get();
        // return from(ref.where('members', 'array-contains', { userId: userId, role: 'owner' }).get()).pipe(
        const _projects = projects.docs.map(items => {
            const isOwner = this.isOwner(items.data().memberRoles);
            const itemData = items.data();
            const memberData = { isOwner, itemData };
            return memberData;
        });

        return _projects;
    }

    public getMyProjects() {
        const userId = this.authenticationService.user?.id || '';

        const ref = this.firebaseService.getDbInstance().collection(this.PROJECT_COLLECTION);

        return from(ref.where('members', 'array-contains', { userId: userId, role: 'owner' }).get()).pipe(
            map(data => {
                const projects = data.docs.map(items => {
                    return items.data();
                });

                return projects;
            })
        );
    }

    public isOwner(memberRoles: [{ userId: string; role: Role }]) {
        return memberRoles.some(member => {
            return member.userId === this.authenticationService.user?.id && ['owner'].includes(member.role);
        });
    }

    public async ownerLookup(memberRoles: [{ userId: string; role: Role }]) {
        const ownerId = memberRoles.filter(member => member.role.includes('owner'));
        const userRef = this.firebaseService
            .getDbInstance()
            .collection('users')
            .doc(ownerId[0].userId);
        try {
            const doc = await userRef.get();
            if (doc.exists) {
                const ownerFirstName = doc.data()?.firstName;
                const ownerLastName = doc.data()?.lastName;
                return ownerFirstName + ' ' + ownerLastName;
            } else {
                //undefined
                return;
            }
        } catch (error) {
            // TODO: handle error;
            return;
        }
    }

    public async updateProjectRoles(projectRoles: { userId: string; role: Role }[]) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.memberRoles = projectRoles;

        const setResult = await this.setProject(_projectConfig);
        return setResult;
    }

    public subscribeAndSetProject(projectId: string, sharePermission?: SharePermission) {
        // this.firebaseService.getDbInstance()!.collection(this.PROJECT_COLLECTION).doc(projectId).onSnapshot()
        this.unsubscribeToProjectListener = this.firebaseService
            .getDbInstance()!
            .collection(this.PROJECT_COLLECTION)
            .doc(projectId)
            .onSnapshot(
                document => {
                    const project = document.data() as Project;

                    if (!project) {
                        this.router.navigate(['404']);
                    }

                    if (sharePermission) {
                        this._projectMode.next(sharePermission);
                    } else if (
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
        console.log(addMemberResult);
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

                // combine existing members and pending members with new ones
                if (users?.newMembers) {
                    users?.newMembers.map(member => {
                        return newMembers.push({ userId: member, role: role || 'viewer' });
                    });
                    _projectConfig.members = _.union(_projectConfig.members, users.newMembers);
                    _projectConfig.memberRoles = _.union(_projectConfig.memberRoles, newMembers);
                }
                console.log(users?.pendingMembers);
                if (users?.pendingMembers) {
                    users?.pendingMembers.map(member => {
                        return pendingMembers.push({ email: member, role: role || 'viewer' });
                    });
                    _projectConfig.pendingMembers = _.union(_projectConfig.pendingMembers, users.pendingMembers);
                }
                const addInvitations = await this.addInvitations(pendingMembers, this.projectConfig?.id);
                if (addInvitations === true) {
                    const setResult = await this.setProject(_projectConfig);
                    return setResult;
                } else {
                    return false;
                }
            })
            .catch(function(error: Error) {
                console.log(error, 'add members error');
                // TODO handle error
                return false;
            });
    }

    public async removeProjectMember(userId: string) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig.members = _projectConfig?.members?.filter(member => {
            return member !== userId;
        });
        _projectConfig.memberRoles = _projectConfig?.memberRoles?.filter(member => {
            return member.userId !== userId;
        });
        const setResult = await this.setProject(_projectConfig);
        return setResult;
    }

    private async addInvitations(pendingMembers: { email: string; role: Role }[], projectId: string | undefined) {
        if (!projectId) {
            return;
        }
        const db = this.firebaseService.getDbInstance()!;
        const batch = db.batch();
        const projectRef = db.collection(this.PROJECT_COLLECTION).doc(projectId);

        pendingMembers.map(member => {
            let invitationRef = db.collection(this.INVITATION_COLLECTION).doc();
            batch.set(invitationRef, { email: member.email, role: member.role, project: projectRef });
        });

        // Commit the batch
        return batch
            .commit()
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public async generateShareLink(permission: SharePermission) {
        const db = this.firebaseService.getDbInstance();
        const currentUserId = this.authenticationService.user?.id;
        const currentProjectId = this._projectConfig.getValue().id;

        if (!db || !currentUserId || !currentProjectId) {
            console.log('Cannot generate share link when db/userid/projectid is missing');

            return;
        }

        const shareLink: ShareLink = {
            userId: currentUserId,
            projectId: currentProjectId,
            permission,
        };
        const configUpdate = this._projectConfig.getValue();
        configUpdate.shareLink = shareLink;

        const updatedConfig = await this.updateProject(configUpdate);

        return updatedConfig ? shareLink : undefined;
    }
    public async deleteShareLink() {
        const db = this.firebaseService.getDbInstance();
        const currentUserId = this.authenticationService.user?.id;
        const currentProjectId = this._projectConfig.getValue().id;

        if (!db || !currentUserId || !currentProjectId) {
            console.log('Cannot generate share link when db/userid/projectid is missing');

            return;
        }

        const configUpdate = this._projectConfig.getValue();
        delete configUpdate.shareLink;

        const updatedConfig = await this.updateProject(configUpdate, false);
    }

    public async getShareLink() {
        const db = this.firebaseService.getDbInstance();
        const currentProjectId = this._projectConfig.getValue().id;

        const existingShareLink = await db
            .collection(this.SHARE_COLLECTION)
            .where('projectId', '==', currentProjectId)
            .get();

        if (existingShareLink.docs.length) {
            return (existingShareLink.docs[0].data() as unknown) as ShareLink;
        } else {
            return undefined;
        }
    }

    public checkNewUserProjects() {
        const db = this.firebaseService.getDbInstance()!;
        const invitationRef = db.collection(this.INVITATION_COLLECTION).doc();
    }

    public resetProject() {
        const unsub = this.unsubscribeToProjectListener ? this.unsubscribeToProjectListener() : undefined;
        this._projectConfig.next(this.createBaseProject('', '', ''));
        this._projectMode.next('view');
        this.router.navigate(['/project']);
    }
}
