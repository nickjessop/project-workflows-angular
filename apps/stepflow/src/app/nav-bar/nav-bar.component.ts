import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Project } from '../models/interfaces/project';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { ProjectService } from '../services/project/project.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
    items!: MenuItem[];

    public displayName: string = '';
    public photoURL: string = '';
    public loggedInUserId: string = '';
    public authenticated: boolean = false;

    private subscriptions = new Subscription();

    public href: string = '';
    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    linkCopiedMsg: any[] = [];

    displaySettingsDialog: boolean = false;

    public navMode: 'default' | 'project' = 'default';
    public project?: Project;

    constructor(
        private authService: AuthenticationService,
        private projectService: ProjectService,
        private location: Location,
        private router: Router
    ) {}

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
                if (projectData?.id) {
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
                    this.loggedInUserId = this.authService.user?.id || '';
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
        this.authService.logout(true);
        this.authenticated = false;
    }

    showSettingsDialog() {
        this.displaySettingsDialog = true;
    }

    hideSettingsDialog() {
        this.displaySettingsDialog = false;
    }

    onBack() {
        this.projectService.resetProject();
    }
}
