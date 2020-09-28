import { Component, OnInit, Input } from '@angular/core';
import { Project, Step } from 'src/app/models/interfaces/project';

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
    @Input() projectConfig?: Project;

    public steps: Step[] = [];

    constructor() {}

    ngOnInit() {
        if (this.projectConfig?.configuration) {
            this.steps = this.projectConfig.configuration.map(projectConfg => {
                return projectConfg.step;
            });
        }

        console.log(`steps: ${JSON.stringify(this.steps)}`);
    }
}
