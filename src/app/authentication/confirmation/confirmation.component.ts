import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
    public msg: string =
        'I just joined the waitlist for Stepflow, an upcoming app that lets you collaborate more efficiently with people outside your organization. Read more at';
    constructor() {}

    ngOnInit(): void {}
}
