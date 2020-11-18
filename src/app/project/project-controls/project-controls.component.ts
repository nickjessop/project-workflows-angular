import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-project-controls',
    templateUrl: './project-controls.component.html',
    styleUrls: ['./project-controls.component.scss'],
})
export class ProjectControlsComponent implements OnInit {
    @Input() projectName = '';

    constructor() {}

    ngOnInit(): void {}
}
