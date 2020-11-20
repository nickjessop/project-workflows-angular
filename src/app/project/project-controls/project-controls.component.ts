import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Role {
    name: string;
}
interface Permission {
    permission: string;
}

@Component({
    selector: 'app-project-controls',
    templateUrl: './project-controls.component.html',
    styleUrls: ['./project-controls.component.scss'],
    providers: [MessageService],
})
export class ProjectControlsComponent implements OnInit {
    @Input() projectName = '';

    public href: string = '';
    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    linkCopiedMsg: any[] = [];

    roles: Role[];
    selectedRole!: Role;

    permissions: Permission[];
    selectedPermission!: Permission;

    projectUsers = [
        {
            name: 'Michael Jean',
            email: 'michael@parachutelabs.ca',
            role: 'Owner',
        },
        {
            name: 'Nick Jessop',
            email: 'nick@parachutelabs.ca',
            role: 'Owner',
        },
        {
            name: 'Michael Scott',
            email: 'michael@dundermifflin.com',
            role: 'Participant',
        },
        {
            name: 'Jane Doe',
            email: 'jane@hey.com',
            role: 'Viewer',
        },
    ];

    displayShareDialog: boolean = false;

    showShareDialog() {
        this.displayShareDialog = true;
    }

    hideShareDialog() {
        this.displayShareDialog = false;
    }

    copyInputMessage(linkInput: any) {
        linkInput.select();
        document.execCommand('copy');
        linkInput.setSelectionRange(0, 0);
        this.messageService.add({
            key: 'linkCopied',
            severity: 'success',
            detail: 'Link copied',
        });
    }

    hideLinkCopiedMsg() {
        this.linkCopiedMsg = [];
    }

    constructor(private router: Router, private messageService: MessageService) {
        this.roles = [
            {
                name: 'Owner',
            },
            {
                name: 'Editor',
            },
            {
                name: 'Participant',
            },
            {
                name: 'Viewer',
            },
        ];
        this.permissions = [
            {
                permission: 'Restricted',
            },
            {
                permission: 'Open',
            },
        ];
    }

    ngOnInit(): void {
        this.href = this.baseUrl + this.router.url;
    }
}
