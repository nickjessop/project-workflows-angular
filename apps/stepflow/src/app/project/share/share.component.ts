import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { Project, ProjectUsers, Role } from '../../models/interfaces/project';
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

    displayShareDialog: boolean = false;
    displayDialogSave: boolean = false;

    public roles: { value: Role; label: string }[] = [
        { value: 'creator', label: 'Can configure' },
        { value: 'editor', label: 'Can edit' },
        { value: 'viewer', label: 'Can view' },
    ];

    constructor(private projectService: ProjectService, private messageService: MessageService) {}

    ngOnInit(): void {
        if (this.project) {
            this.projectService.getProjectUserDetails(this.project.memberRoles).then(result => {
                this.projectUsers = result?.filter(user => !(user.id === this.loggedInUserId && user.role === 'owner'));
                //TODO users can add new owners and owners can change each other's roles (this is how G docs goes about it but would need to think about it some more)
                this.projectOwners = result?.filter(user => user.role === 'owner');
            });
        }
    }

    public showShareDialog() {
        this.displayShareDialog = true;
    }

    public hideShareDialog() {
        this.displayShareDialog = false;
    }

    public updatePermissions(event: { value: Role }, userId: string) {
        let _projectUsers = _.cloneDeep(this.projectUsers);
        let _projectOwners = _.cloneDeep(this.projectOwners);
        _projectUsers = this.projectUsers?.map(projectMember => {
            if (userId === projectMember.userId) {
                projectMember.role = event.value;
            }
            return { role: projectMember.role, userId: projectMember.userId };
        });
        _projectOwners = this.projectOwners?.map(projectOwner => {
            return { role: projectOwner.role, userId: projectOwner.userId };
        });
        if (_projectUsers && _projectOwners) {
            this.updatedMemberRoles = _projectUsers.concat(_projectOwners);
            this.displayDialogSave = true;
        }
    }

    public onSavePermissionsSelected() {
        this.projectService.updateProjectRoles(this.updatedMemberRoles).then(
            (value: any) => {
                if (value === true) {
                    this.displayDialogSave = false;
                    this.messageService.add({
                        key: 'global-toast',
                        severity: 'success',
                        detail: 'Permissions updated.',
                    });
                } else {
                    this.messageService.add({
                        key: 'global-toast',
                        severity: 'error',
                        detail: "Can't update permissions. Please try again.",
                    });
                    this.displayDialogSave = false;
                }
            },
            reason => {}
        );
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
}
