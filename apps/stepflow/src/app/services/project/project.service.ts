import { moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    allowedModes,
    BlockConfig,
    Member,
    Project,
    ProjectMode,
    Role,
    SharePermission,
    Status,
    Step,
    StepConfig,
} from '@stepflow/interfaces';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { CoreComponentService } from '../../core/core-component.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private readonly PROJECT_COLLECTION = 'projects';
    private readonly INVITATION_COLLECTION = 'invitations';
    private readonly MEMBERSHIP_COLLECTION = 'members';
    private readonly SHARE_COLLECTION = 'shareLinks';
    private _projectConfig: BehaviorSubject<Project | undefined> = new BehaviorSubject<Project | undefined>(undefined);
    public readonly projectConfig$ = this._projectConfig.asObservable();
    public isDragging: EventEmitter<boolean> = new EventEmitter();

    private _projectMode: BehaviorSubject<ProjectMode | undefined> = new BehaviorSubject<ProjectMode | undefined>(
        undefined
    );
    public readonly projectMode$ = this._projectMode.asObservable();

    private _modesAvailable: BehaviorSubject<{
        allowedProjectModes: { [path in ProjectMode]: boolean };
    }> = new BehaviorSubject<{ allowedProjectModes: { [path in ProjectMode]: boolean } }>({
        allowedProjectModes: { configure: false, edit: false, view: false },
    });
    public readonly modesAvailable$ = this._modesAvailable.asObservable();

    constructor(
        private supabaseService: SupabaseService,
        private authenticationService: AuthenticationService,
        private coreComponentService: CoreComponentService,
        private router: Router
    ) {}

    public get projectConfig() {
        return this._projectConfig.getValue();
    }

    public set projectConfig(project: Project | undefined) {
        this._projectConfig.next(project);
    }

    public get projectMode() {
        return this._projectMode.getValue();
    }

    public set projectMode(mode: ProjectMode | undefined) {
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
    private areProjectsDifferent(project1?: Project, project2?: Project) {
        if (!project1 || !project2 || (!project1 && !project2)) {
            return false;
        }

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

        return false;
    }

    ngOnDestroy() {
        this.supabaseService.supabase.removeAllSubscriptions();
    }

    public syncProject() {
        const projCopy = _.cloneDeep(this.projectConfig);
        if (!projCopy) {
            return;
        }

        this.projectConfig = projCopy;
        this.updateProject(this.projectConfig);
    }

    public createBaseProject(projectName: string, description?: string, configuration?: StepConfig[]) {
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
            configuration: config,
        };

        return baseProject;
    }

    public swapBlockOrder(previousIndex: number, currentIndex: number) {
        // moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
        const currentStepIndex =
            this.projectConfig?.configuration?.findIndex(config => {
                return config.step.isCurrentStep;
            }) || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);

        moveItemInArray(_projectConfig!.configuration![currentStepIndex].components!, previousIndex, currentIndex);
        // this.projectConfig = _projectConfig;
        this.setProject(_projectConfig!);
    }

    public setBlockDrag(dragging: boolean) {
        this.isDragging.emit(dragging);
    }

    public swapStepOrder(previousIndex: number, currentIndex: number) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        moveItemInArray(_projectConfig!.configuration!, previousIndex, currentIndex);
        this.setProject(_projectConfig!);
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
        _projectConfig!.configuration![currentStepIndex].step = step;

        this.setProject(_projectConfig!);
    }

    public async createNewProject(projectName: string, projectDescription?: string) {
        const userId = this.authenticationService.user?.id;

        const baseProject = this.createBaseProject(projectName, projectDescription);

        const { data, error } = await this.supabaseService.supabase.rpc<Project['id']>('create_project', {
            name: baseProject.name,
            configuration: baseProject.configuration,
            description: baseProject.description,
        });

        if (error) console.error(error);
        else console.log(data);

        // const { data, error } = await this.supabaseService.supabase
        //     .from<Project>(this.PROJECT_COLLECTION)
        //     .insert([baseProject]);

        return error ? undefined : data;
    }

    private async updateProject(projectConfig: Project) {
        const { data, error } = await this.supabaseService.supabase
            .from<Project>(this.PROJECT_COLLECTION)
            .upsert(projectConfig);

        if (data !== null) {
            this.projectConfig = data[0];
            this.setProject(data[0], false);
            return true;
        }

        return false;
    }

    public async deleteProject(projectId: string) {
        const response = await this.supabaseService.supabase
            .from(this.PROJECT_COLLECTION)
            .delete()
            .match({ id: projectId });

        if (!response.data || response.data?.[0] === null) {
            return false;
        }

        return true;
    }

    public addProjectBlock(projectBlock: BlockConfig) {
        const currentStepIndex = this.getCurrentStepIndex() || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig!.configuration![currentStepIndex].components?.push(projectBlock);

        // this.projectConfig = _projectConfig;
        this.setProject(_projectConfig!);
    }

    public async updateProjectSettings(projectSettings: { name: string; description: string }) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig!.name = projectSettings.name;
        _projectConfig!.description = projectSettings.description;
        const setResult = await this.setProject(_projectConfig!);
        return setResult;
    }

    public addProjectStep(newStep: StepConfig) {
        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig!.configuration?.push(newStep);

        this.setNewCurrentProjectStep(
            _projectConfig?.configuration ? _projectConfig.configuration.length - 1 : 0,
            _projectConfig
        );

        this.setProject(_projectConfig!);
    }

    public deleteProjectBlock(blockIndex: number) {
        const currentStepIndex = this.getCurrentStepIndex() || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig!.configuration![currentStepIndex].components!.splice(blockIndex, 1);

        this.setProject(_projectConfig!);
    }

    public deleteCurrentProjectStep() {
        const currentStepIndex = this.getCurrentStepIndex() || 0;

        const _projectConfig = _.cloneDeep(this.projectConfig);
        _projectConfig!.configuration?.splice(currentStepIndex, 1);

        this.setProject(_projectConfig!);
    }

    private getCurrentStepIndex() {
        const currentStepIndex = this.projectConfig!.configuration?.findIndex(config => {
            return config.step.isCurrentStep;
        });

        return currentStepIndex;
    }

    public getCurrentStep() {
        const index = this.getCurrentStepIndex() || 0;

        return this.projectConfig!.configuration![index].step;
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
            : this.resetCurrentProjectSteps(_.cloneDeep(this.projectConfig!));

        if (_projectConfig.configuration?.[stepIndex]) {
            _projectConfig.configuration[stepIndex].step.isCurrentStep = true;
        } else {
            _projectConfig.configuration![0].step.isCurrentStep = true;
        }

        this.setProject(_projectConfig, false);
    }

    public async getProjects() {
        const userId = this.authenticationService.user?.id || '';
        const { data, error } = await this.supabaseService.supabase
            .from<Member & { projects: Pick<Project, 'id' | 'description' | 'name'> }>(this.MEMBERSHIP_COLLECTION)
            .select('project_id, role, projects (id, name, description)')
            .eq('user_id', userId);

        if (error || data === null) {
            return;
        }

        const _projects = data.map(project => {
            const { role, projects } = project;

            return {
                isOwner: role === 'owner',
                description: projects.description,
                id: projects.id,
                name: projects.name,
            };
        });

        return _projects;
    }

    public async getProjectById(projectId: string) {
        const { data, error } = await this.supabaseService.supabase
            .from<Project>(`${this.PROJECT_COLLECTION}`)
            .select('*')
            .eq('id', projectId);

        return data ?? undefined;
    }

    public async subscribeAndSetProject(projectId: string) {
        const project = await this.getProjectById(projectId);

        if (!project) {
            return;
        }

        this.projectConfig = project[0];

        this.supabaseService.supabase
            .from<Project>(`${this.PROJECT_COLLECTION}:id=eq.${projectId}`)
            .on('*', projectUpdate => {
                // const oldProject = projectUpdate.old; // old pre-updated project
                const project = projectUpdate.new; // new updated project

                if (projectUpdate.eventType === 'DELETE' || !this.authenticationService.user?.id) {
                    return this.router.navigate(['404']);
                }

                this.projectConfig = project;

                return;
            });

        const currentUserId = this.authenticationService.user?.id;

        if (!currentUserId) {
            return;
        }

        const { data, error } = await this.supabaseService.supabase
            .from<Member>(this.MEMBERSHIP_COLLECTION)
            .select('*')
            .eq('user_id', currentUserId)
            .eq('project_id', projectId);

        if (data === null) {
            return;
        }

        const role = data[0].role;
        const permissions = allowedModes[role];
        this._modesAvailable.next(permissions);
        const { configure, edit } = permissions.allowedProjectModes;
        this._projectMode.next(configure ? 'configure' : edit ? 'edit' : 'view');

        this.supabaseService.supabase
            .from<Member>(`${this.MEMBERSHIP_COLLECTION}:id=eq.${data[0].id}`)
            .on('*', membershipUpdate => {
                const newRole = membershipUpdate.new.role;
                const permissions = allowedModes[newRole];
                this._modesAvailable.next(permissions);

                const { configure, edit } = permissions.allowedProjectModes;
                this._projectMode.next(configure ? 'configure' : edit ? 'edit' : 'view');
            });
    }

    public async sendProjectInvitations(emails: string[], role: Role) {
        const success = await this.addNewProjectMembers(emails, role);
        return success;
        // const callable = this.firebaseService.getFunctionsInstance().httpsCallable('invitationEmail');
        // return callable({
        //     emails: emails,
        //     subject: `${this.projectConfig?.name} - Invitation to collaborate`,
        //     projectName: `${this.projectConfig?.name}`,
        //     projectSender: `${this.authenticationService.getCurrentUser()?.displayName}`,
        //     projectRole: `${role}`,
        //     fromEmail:
        //         this.authenticationService.getCurrentUser()?.email ||
        //         this.authenticationService.getCurrentUser()?.displayName ||
        //         '',
        //     projectLink: `https://app.stepflow.co/project/${this.projectConfig.id}`,
        // }).then(
        //     (response: { data: { success: boolean } }) => {
        //         console.log(response);
        //         return response;
        //     },
        //     (error: Error) => {
        //         return undefined;
        //     }
        // );
    }

    public async addNewProjectMembers(emails: string[], role: Role) {
        return this.addInvitations([{ email: emails[0], role }], this.projectConfig!.id!);
        // return this.authenticationService
        //     .findUsersMatchingEmail(emails)
        //     .then(async users => {
        //         const _projectConfig = _.cloneDeep(this.projectConfig);
        //         const newMembers: { userId: string; role: Role }[] = [];
        //         const pendingMembers: { email: string; role: Role }[] = [];
        //         // combine existing members and pending members with new ones
        //         if (users?.newMembers) {
        //             users?.newMembers.map(member => {
        //                 return newMembers.push({ userId: member, role: role || 'viewer' });
        //             });
        //             _projectConfig.members = _.union(_projectConfig.members, users.newMembers);
        //             _projectConfig.memberRoles = _.union(_projectConfig.memberRoles, newMembers);
        //         }
        //         if (users?.pendingMembers) {
        //             users?.pendingMembers.map(member => {
        //                 return pendingMembers.push({ email: member, role: role || 'viewer' });
        //             });
        //             _projectConfig.pendingMembers = _.union(_projectConfig.pendingMembers, users.pendingMembers);
        //         }
        //         const addInvitations = await this.addInvitations(pendingMembers, this.projectConfig?.id);
        //         if (addInvitations === true) {
        //             const setResult = await this.setProject(_projectConfig);
        //             return setResult;
        //         } else {
        //             return false;
        //         }
        //     })
        //     .catch(function(error: Error) {
        //         console.log(error, 'add members error');
        //         // TODO handle error
        //         return false;
        //     });
    }

    public async removeProjectMember(userId: string) {
        // const _projectConfig = _.cloneDeep(this.projectConfig);
        // _projectConfig.members = _projectConfig?.members?.filter(member => {
        //     return member !== userId;
        // });
        // _projectConfig.memberRoles = _projectConfig?.memberRoles?.filter(member => {
        //     return member.userId !== userId;
        // });
        // const setResult = await this.setProject(_projectConfig);
        // return setResult;
        return false;
    }

    private async addInvitations(pendingMembers: { email: string; role: Role }[], projectId: string) {
        let { data, error } = await this.supabaseService.supabase.rpc('create_invitation', {
            email: pendingMembers[0].email,
            projectid: projectId,
            role: pendingMembers[0].role,
        });

        if (error) return false;
        else return true;
    }

    public async generateShareLink(permission: SharePermission) {
        // let { data, error } = await this.supabaseService.supabase.rpc('create_sharelink', {
        //     project_id: currentProjectId,
        //     permission,
        // });
        // if (error) console.error(error);
        // else console.log(data);
        // return data;
    }

    // public async deleteShareLink() {
    //     const currentUserId = this.authenticationService.user?.id;
    //     const currentProjectId = this._projectConfig.getValue().id;

    //     if (!currentUserId || !currentProjectId) {
    //         return;
    //     }

    //     const configUpdate = this._projectConfig.getValue();
    //     configUpdate.shareLink = null;
    //     delete configUpdate.shareLink;

    //     const updatedConfig = await this.updateProject(configUpdate);
    // }

    // public async getShareLink() {
    //     const db = this.firebaseService.getDbInstance();
    //     const currentProjectId = this._projectConfig.getValue().id;

    //     const existingShareLink = await db
    //         .collection(this.SHARE_COLLECTION)
    //         .where('projectId', '==', currentProjectId)
    //         .get();

    //     if (existingShareLink.docs.length) {
    //         return existingShareLink.docs[0].data() as unknown as ShareLink;
    //     } else {
    //         return undefined;
    //     }
    // }

    //     await this.updateProject(configUpdate);
    // }

    public resetProject() {
        this.supabaseService.supabase.removeAllSubscriptions();
        this._projectConfig.next(undefined);
        this._projectMode.next(undefined);
        this.router.navigate(['/project']);
    }
}
