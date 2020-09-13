import { Component, OnInit, Input } from '@angular/core';
import { ProjectConfig } from 'src/app/models/interfaces/project';

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
    @Input() projectConfig: ProjectConfig[] = [];

    constructor() {}

    ngOnInit(): void {
        console.log;
    }
}
