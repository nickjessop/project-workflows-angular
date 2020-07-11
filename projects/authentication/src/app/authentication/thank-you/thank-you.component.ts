import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
    constructor(private authService: AuthenticationService) {}

    ngOnInit() {}

    public onLogoutClick() {
        this.authService.logout();
    }
}
