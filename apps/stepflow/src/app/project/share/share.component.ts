import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectUsers, Role, SharePermission } from '@stepflow/interfaces';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ProjectService } from '../../services/project/project.service';

@Component({
    selector: 'project-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
    @Input() project?: Project;
    @Input() loggedInUserId?: string;

    public projectUsers?: ProjectUsers[];
    public projectOwners?: ProjectUsers[];
    public updatedMemberRoles?: any;
    public invitationEmails: string[] = [];
    public invitationRole: Role = 'viewer';
    public allowEmailSubmission: boolean = false;
    public emailValidationMsg: string = '';
    public isLoading: boolean = false;
    public displayShareDialog: boolean = false;
    public displayDialogSave: boolean = false;

    public sharePermissions = [{ value: 'view' }, { value: 'edit' }];
    public selectedSharePermission: SharePermission = 'view';
    public shareLink?: string;
    public shareLinkChecked: boolean = false;
    public shareLinkMsg: string = 'Enable a public link that can be shared with anyone.';

    public roles: { value: Role; label: string }[] = [
        { value: 'creator', label: 'Can configure' },
        { value: 'editor', label: 'Can edit' },
        { value: 'viewer', label: 'Can view' },
    ];

    public pendingEmails?: { email: string; role: Role }[];

    constructor(
        public projectService: ProjectService,
        private messageService: MessageService,
        public authenticationService: AuthenticationService
    ) {}

    ngOnInit(): void {
        if (this.project) {
            this.projectService.getProjectUserDetails(this.project.memberRoles).then(result => {
                this.projectUsers = result?.filter(user => user.role !== 'owner');
                //TODO users can add new owners and owners can change each other's roles (this is how G docs goes about it but would need to think about it some more)
                this.projectOwners = result?.filter(user => user.role === 'owner');
            });

            this.initShareLink();
        }
    }

    public showShareDialog() {
        this.displayShareDialog = true;
    }

    public hideShareDialog() {
        this.displayShareDialog = false;
    }

    private async initShareLink() {
        if (this.project?.shareLink) {
            const { userId, projectId, permission } = this.project.shareLink;

            this.shareLink = `${location.host}/project/${userId}/${projectId}/${permission}`;
            this.shareLinkChecked = true;
        }
    }

    public validateEmails() {
        const emails: boolean[] = [];
        this.invitationEmails?.map(email => {
            const validEmail = /\S+@\S+\.\S+/;
            emails.push(validEmail.test(email));
        });
        const checkValidEmails = (emails: boolean[]) => emails.every(email => email === true);
        let checkDuplicateEmails = (arr: string[]) => arr.filter((e: string, i: number) => arr.indexOf(e) != i);
        const duplicateEmails = [...new Set(checkDuplicateEmails(this.invitationEmails))];
        if (checkValidEmails(emails) === false) {
            this.allowEmailSubmission = false;
            this.emailValidationMsg = 'Please enter valid emails.';
        } else if (emails.length > 10) {
            // emails.length < 10 required for a firebase limitation
            this.allowEmailSubmission = false;
            this.emailValidationMsg = 'Please enter no more than 10 emails to invite.';
        } else if (duplicateEmails.length > 0) {
            this.allowEmailSubmission = false;
            this.emailValidationMsg = 'Please remove the following duplicate emails: ' + duplicateEmails;
        } else {
            this.allowEmailSubmission = true;
            this.emailValidationMsg = '';
        }
    }

    public updatePermissions(event: { value: Role }, userId: string) {
        this.messageService.add({
            key: 'global-toast',
            severity: 'error',
            detail: 'Not implemented',
        });

        // let _projectUsers = _.cloneDeep(this.projectUsers);
        // let _projectOwners = _.cloneDeep(this.projectOwners);
        // _projectUsers = this.projectUsers?.map(projectMember => {
        //     if (userId === projectMember.userId) {
        //         projectMember.role = event.value;
        //     }
        //     return { role: projectMember.role, userId: projectMember.userId };
        // });
        // _projectOwners = this.projectOwners?.map(projectOwner => {
        //     return { role: projectOwner.role, userId: projectOwner.userId };
        // });
        // if (_projectUsers && _projectOwners) {
        //     this.updatedMemberRoles = _projectUsers.concat(_projectOwners);
        //     this.displayDialogSave = true;
        // }
    }

    public onSavePermissionsSelected() {
        this.projectService.updateProjectRoles(this.updatedMemberRoles).then(
            (value: any) => {
                if (value === true) {
                    this.displayShareDialog = false;
                    this.displayDialogSave = false;
                    this.messageService.add({
                        key: 'global-toast',
                        severity: 'success',
                        detail: 'Permissions updated.',
                    });
                } else {
                    this.displayShareDialog = false;
                    this.displayDialogSave = false;
                    this.messageService.add({
                        key: 'global-toast',
                        severity: 'error',
                        detail: "Can't update permissions. Please try again.",
                    });
                }
            },
            reason => {
                // TODO: Error handling
            }
        );
    }

    public async onSendInvitationsSelected() {
        if (this.invitationEmails.length === 0 || !this.allowEmailSubmission) {
            return;
        }

        this.isLoading = true;
        const success = await this.projectService.sendProjectInvitations(this.invitationEmails, this.invitationRole);

        if (!success) {
            this.messageService.add({
                key: 'global-toast',
                severity: 'error',
                summary: "Can't send invitation emails.",
                detail: 'Please make sure you have entered valid emails. The number of emails must be 10 or less.',
            });
        }

        this.messageService.add({
            key: 'global-toast',
            severity: 'success',
            detail: 'Invitations sent.',
        });

        this.isLoading = false;
        this.displayShareDialog = false;
        this.invitationEmails = [];
    }

    public getUserMenuItems(userId: string, email: string): MenuItem[] {
        return [
            {
                label: 'Remove user',
                icon: 'pi pi-times',
                command: () => {
                    this.onRemoveUser(userId, email);
                },
            },
        ];
    }

    public async onRemoveUser(userId: string, email: string) {
        const removeMemberResult = await this.projectService.removeProjectMember(userId);
        if (removeMemberResult == true) {
            this.messageService.add({
                key: 'global-toast',
                severity: 'success',
                detail: `Successfully removed ${email} from the project.`,
            });
            this.hideShareDialog();
        } else {
            this.messageService.add({
                key: 'global-toast',
                severity: 'error',
                summary: `Can't remove ${email} from the project.`,
                detail: 'Please try again.',
            });
        }
    }

    // copyInputMessage(linkInput: any) {
    //     linkInput.select();
    //     document.execCommand('copy');
    //     linkInput.setSelectionRange(0, 0);
    //     this.messageService.add({
    //         key: 'global-toast',
    //         severity: 'success',
    //         detail: 'Link copied',
    //     });
    // }

    // hideLinkCopiedMsg() {
    //     this.linkCopiedMsg = [];
    // }

    public enableShareLink(event: any) {
        if (event.checked === true) {
            this.generateSharingLink();
        } else {
            this.deleteShareLink();
        }
    }

    private async deleteShareLink() {
        const res = await this.projectService.deleteShareLink();
    }

    public async generateSharingLink() {
        const shareLink = await this.projectService.generateShareLink(this.selectedSharePermission);

        if (shareLink) {
            this.shareLink = `${location.host}/project/${shareLink.userId}/${shareLink.projectId}/${shareLink.permission}`;
        }
    }

    copyInputMessage(linkInput: any) {
        linkInput.select();
        document.execCommand('copy');
        linkInput.setSelectionRange(0, 0);
        this.messageService.add({
            key: 'global-toast',
            severity: 'success',
            detail: 'Link copied',
        });
    }
}
