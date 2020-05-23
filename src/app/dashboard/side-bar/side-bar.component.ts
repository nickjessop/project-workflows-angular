import { Component, Input, OnInit } from '@angular/core';
import { SideBarItem } from '../../models/interfaces/side-bar-item';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
    @Input() sideBarItems: SideBarItem[] = [{ displayText: '', isTitle: false }];

    constructor() {}

    ngOnInit() {}
}
