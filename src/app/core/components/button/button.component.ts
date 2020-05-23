import { Component, OnInit, Input } from '@angular/core';
import { ButtonType } from '../../../models/interfaces/core-component';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
    expanded = false;

    @Input() buttonStyle: ButtonType = 'button--primary';
    @Input() text = 'Button';
    @Input() dropdownItems = ['Option 1', 'Option 2', 'Option 3'];
    @Input() icon = '';
    @Input() dropdownPosition = 'dropdown--left';

    constructor() {}

    ngOnInit() {}

    onClick() {
        this.expanded = !this.expanded;
    }
}
