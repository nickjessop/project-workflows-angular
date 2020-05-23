import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
    @Input() steps: string[] = [''];

    constructor() {}

    public dummySteps = [
        {
            title: 'step 1',
            completed: true,
        },
        {
            title: 'step 2',
            completed: false,
            focused: true,
        },
        {
            title: 'step 3',
            completed: false,
        },
    ];

    ngOnInit() {}
}
