import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() label = '';

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    constructor() {}

    ngOnInit() {}

    public onDeleteBlock() {
        console.log('block deleted');
    }
}
