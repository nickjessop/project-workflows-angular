import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project, ProjectMode } from '@stepflow/interfaces';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
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

    public projectMode?: ProjectMode;
    public isNewProject = false;
    public canConfigureProject = false;

    public displaySettingsDialog: boolean = false;
    public showSettingsError: boolean = false;

    public navMode: 'default' | 'project' = 'default';
    public project?: Project;
    public projectSettings: {
        name: string;
        description: string;
    } = {
        name: '',
        description: '',
    };

    constructor(
        private authService: AuthenticationService,
        private projectService: ProjectService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.items = [
            {
                label: 'Account settings',
                icon: 'pi pi-fw pi-user',
                command: () => {
                    this.router.navigateByUrl('/profile');
                },
            },
            // { label: 'Account settings', icon: 'pi pi-fw pi-user', url: '/profile' },
            // temporary fix above instead of using routerLink: issue #44
            // { label: 'Tell a friend', icon: 'pi pi-fw pi-thumbs-up', routerLink: ['/share'] },
            {
                label: 'Sign out',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                    this.logout();
                },
            },
        ];

        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe((projectData) => {
                this.project = projectData;
                if (projectData?.id) {
                    this.navMode = 'project';
                } else {
                    this.navMode = 'default';
                }
            })
        );

        this.subscriptions.add(
            this.projectService.projectMode$.subscribe((result) => {
                this.projectMode = result;
                if (this.projectMode === 'configure') {
                    this.canConfigureProject = true;
                } else {
                    this.canConfigureProject = false;
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
        this.projectSettings = {
            name: this.project?.name || '',
            description: this.project?.description || '',
        };
    }

    hideSettingsDialog() {
        this.displaySettingsDialog = false;
        this.showSettingsError = false;
    }

    onSaveSettingsSelected() {
        if (!this.projectSettings.name) {
            this.showSettingsError = true;
            return;
        }
        this.projectService.updateProjectSettings(this.projectSettings).then((value) => {
            if (value === true) {
                this.messageService.add({
                    key: 'global-toast',
                    severity: 'success',
                    detail: 'Project details updated.',
                });
            } else {
                this.messageService.add({
                    key: 'global-toast',
                    severity: 'error',
                    detail: "Can't update project details. Please try again.",
                });
            }
        });
        this.hideSettingsDialog();
    }
    onBack() {
        this.projectService.resetProject();
    }
    openRegistration() {
        window.open('/auth/register', '_blank');
    }
}
