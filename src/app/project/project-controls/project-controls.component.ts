import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Role {
    name: string;
}

@Component({
    selector: 'app-project-controls',
    templateUrl: './project-controls.component.html',
    styleUrls: ['./project-controls.component.scss'],
})
export class ProjectControlsComponent implements OnInit {
    @Input() projectName = '';

    public href: string = '';
    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    linkCopiedMsg: any[] = [];

    roles: Role[];

    selectedRole!: Role;

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

    copyInputMessage(linkInput: any) {
        linkInput.select();
        document.execCommand('copy');
        linkInput.setSelectionRange(0, 0);
        this.linkCopiedMsg.push({ severity: 'success', text: 'Link copied' });
    }

    hideLinkCopiedMsg() {
        this.linkCopiedMsg = [];
    }

    constructor(private router: Router) {
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
    }

    ngOnInit(): void {
        this.href = this.baseUrl + this.router.url;
    }
}
