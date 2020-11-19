import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
    items!: MenuItem[];
    @Input() showUsername = true;

    constructor() {}

    ngOnInit(): void {
        this.items = [
            { label: 'Profile', icon: 'pi pi-fw pi-user' },
            { label: 'Settings', icon: 'pi pi-fw pi-cog' },
            { label: 'Tell a friend', icon: 'pi pi-fw pi-thumbs-up' },
            { label: 'Sign out', icon: 'pi pi-fw pi-sign-out' },
        ];
    }
}
