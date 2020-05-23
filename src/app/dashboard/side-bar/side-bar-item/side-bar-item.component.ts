import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SideBarItem } from '../../../models/interfaces/side-bar-item';

@Component({
    selector: 'app-side-bar-item',
    templateUrl: './side-bar-item.component.html',
    styleUrls: ['./side-bar-item.component.scss'],
})
export class SideBarItemComponent implements OnInit {
    @Input() sideBarItem: SideBarItem = { displayText: '', isTitle: false };

    @Output() onPress: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
