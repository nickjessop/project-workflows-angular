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
    ShareLink,
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
    private readonly SHARE_LINK_COLLECTION = 'sharelinks';
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
    }

    public async addNewProjectMembers(emails: string[], role: Role) {
        return this.addInvitations([{ email: emails[0], role }], this.projectConfig!.id!);
    }

    public async removeProjectMember(userId: string) {
        return false;
    }

    public async getProjectMembers() {
        // const { data, error } = await this.supabaseService.supabase
        //     .from<Member & { projects: Pick<Project, 'id' | 'description' | 'name'> }>(this.MEMBERSHIP_COLLECTION)
        //     .select('project_id, role, projects (id, name, description)')
        //     .eq('user_id', userId);

        const { data, error } = await this.supabaseService.supabase
            .from<Member>(this.MEMBERSHIP_COLLECTION)
            .select()
            .eq('project_id', this.projectConfig!.id!);

        return data;
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
        const project_id = this.projectConfig?.id;
        const user_id = this.authenticationService.user?.id;

        if (!project_id || !user_id) {
            return;
        }

        const shareLink: ShareLink = { permission, project_id, user_id };

        const { data, error } = await this.supabaseService.supabase
            .from<ShareLink>(this.SHARE_LINK_COLLECTION)
            .upsert(shareLink);

        return data?.[0];
    }

    public async deleteShareLink() {
        const currentProjectId = this.projectConfig?.id;

        if (!currentProjectId) {
            return;
        }
        const { data, error } = await this.supabaseService.supabase
            .from<ShareLink>(this.SHARE_LINK_COLLECTION)
            .delete()
            .eq('project_id', currentProjectId);
        return data?.[0];
    }

    public async getShareLink() {
        const projId = this.projectConfig?.id;

        if (!projId) {
            return;
        }

        const { data, error } = await this.supabaseService.supabase
            .from<ShareLink>(this.SHARE_LINK_COLLECTION)
            .select('*')
            .eq('project_id', projId);

        return data?.[0];
    }

    //     await this.updateProject(configUpdate);
    // }

    public resetProject() {
        this.supabaseService.supabase.removeAllSubscriptions();
        this._projectConfig.next(undefined);
        this._projectMode.next(undefined);
        this.router.navigate(['/project']);
    }
}
