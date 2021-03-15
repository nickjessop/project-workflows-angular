import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
    items!: MenuItem[];
    @Input() showUsername = true;

    constructor(private authService: AuthenticationService) {}

    ngOnInit(): void {
        this.items = [
            { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: '/profile' },
            // { label: 'Tell a friend', icon: 'pi pi-fw pi-thumbs-up', routerLink: '/share' },
            {
                label: 'Sign out',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                    this.logout();
                },
            },
        ];
    }

    private logout() {
        this.authService.logout();
    }
}
