import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
    public msg: string =
        'I just joined the waitlist for Stepflow, an upcoming app that lets you collaborate more efficiently with people outside your organization. Read more at';
    public authPlan: string = 'Essential';
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.authPlan = params['plan'] || 'Essential';
        });
    }
}
