import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project, ProjectMode } from '@stepflow/interfaces';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService, AuthStatus } from '../services/authentication/authentication.service';
import { ProjectService } from '../services/project/project.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
    items!: MenuItem[];
    private subscriptions = new Subscription();

    public displayName = '';
    public photoURL = '';
    public loggedInUserId = '';
    public authenticated = false;

    public projectMode?: Observable<ProjectMode>;
    public displaySettingsDialog = false;

    public showSettingsError = false;

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
        this.projectMode = this.projectService.projectMode$;

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
            this.authService.$user.subscribe(user => {
                this.displayName = user?.email || user?.profile.displayName || '';
                this.photoURL = user?.profile.photoURL || '/assets/placeholder/placeholder-profile.png';
                this.loggedInUserId = user?.id || '';
            })
        );

        this.subscriptions.add(
            this.authService.$loginStatus.subscribe(loginStatus => {
                this.authenticated = loginStatus.authStatus === AuthStatus.AUTHENTICATED;
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
        this.projectService.updateProjectSettings(this.projectSettings).then(value => {
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
