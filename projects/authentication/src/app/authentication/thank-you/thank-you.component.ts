import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
    public currentPosition = 2;
    public totalWaitlist = 10;

    constructor(private authService: AuthenticationService) {
        this.initializeUserCount();
    }

    ngOnInit() {}

    public onLogoutClick() {
        this.authService.logout();
    }

    private initializeUserCount() {
        this.authService.getUserTotal().then(
            totalUsers => {
                console.log(`total users = ${totalUsers.data}`);
            },
            error => {
                console.log('ERROR', error);
            }
        );
    }
}
