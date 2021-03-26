import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Project } from '../models/interfaces/project';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { ProjectService } from '../services/project/project.service';

interface Role {
    name: string;
}
interface Permission {
    permission: string;
}

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
    items!: MenuItem[];

    public displayName: string = '';
    public photoURL: string = '';
    public authenticated: boolean = false;

    private subscriptions = new Subscription();

    public href: string = '';
    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    linkCopiedMsg: any[] = [];
    roles: Role[];
    selectedRole!: Role;
    permissions: Permission[];
    selectedPermission!: Permission;

    public navMode: 'default' | 'project' = 'default';
    public project?: Project;

    constructor(
        private authService: AuthenticationService,
        private projectService: ProjectService,
        private messageService: MessageService
    ) {
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
        this.items = [
            { label: 'Account settings', icon: 'pi pi-fw pi-user', routerLink: '/profile' },
            // { label: 'Tell a friend', icon: 'pi pi-fw pi-thumbs-up', routerLink: '/share' },
            {
                label: 'Sign out',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                    this.logout();
                },
            },
        ];

        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(projectData => {
                this.project = projectData;
                if (projectData.id) {
                    this.navMode = 'project';
                } else {
                    this.navMode = 'default';
                }
            })
        );

        this.subscriptions.add(
            this.authService.$user.subscribe({
                next: () => {
                    this.displayName = this.authService.user?.displayName || this.authService.user?.email || '';
                    this.photoURL = this.authService.user?.photoURL || '/assets/placeholder/placeholder-profile.png';
                },
                error: (err: any) => {
                    console.log(err);
                },
            })
        );

        this.subscriptions.add(
            this.authService.$loginStatus.subscribe({
                next: (status: any) => {
                    if (status.authStatus === 0) {
                        this.authenticated = true;
                    } else {
                        this.authenticated = false;
                    }
                },
                error: (err: any) => {
                    console.log(err);
                },
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private logout() {
        this.authService.logout();
        this.authenticated = false;
    }

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

    displaySettingsDialog: boolean = false;

    showSettingsDialog() {
        this.displaySettingsDialog = true;
    }

    hideSettingsDialog() {
        this.displaySettingsDialog = false;
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

    hideLinkCopiedMsg() {
        this.linkCopiedMsg = [];
    }
}
