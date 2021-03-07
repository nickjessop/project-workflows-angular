import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor() {}

    items: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            { label: 'Upload a photo...', icon: 'pi pi-fw pi-upload' },
            { label: 'Remove photo', icon: 'pi pi-fw pi-times' },
        ];
    }
}
