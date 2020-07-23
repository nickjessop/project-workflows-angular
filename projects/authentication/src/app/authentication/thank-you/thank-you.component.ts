import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
    public currentPosition = 2;
    public totalWaitlist = 0;

    constructor(private authService: AuthenticationService) {
        // this.initializeUserCount();
    }

    ngOnInit() {}

    public onLogoutClick() {
        this.authService.logout();
    }

    // private initializeUserCount() {
    //     const test = this.authService.getUserTotal().subscribe(val => {
    //         this.totalWaitlist = val.data;
    //     });
    // }
}
