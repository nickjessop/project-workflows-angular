import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../services/authentication/authentication.service';
@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
    items!: MenuItem[];
    @Input() showUsername = true;

    public displayName: string = '';
    public photoURL: string = '';

    public authenticated: boolean = false;

    constructor(private authService: AuthenticationService) {}

    ngOnInit() {
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

        this.authService.$user.subscribe({
            next: () => {
                this.displayName = this.authService.user?.displayName || this.authService.user?.email || '';
                this.photoURL = this.authService.user?.photoURL || '/assets/placeholder/placeholder-profile.png';
            },
            error: (err: any) => {
                console.log(err);
            },
        });

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
        });
    }

    ngOnDestroy() {
        this.authService.$loginStatus.unsubscribe();
    }

    private logout() {
        this.authService.logout();
        this.authenticated = false;
    }
}
