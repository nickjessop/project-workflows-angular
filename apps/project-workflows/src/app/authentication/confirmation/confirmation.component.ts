import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
    public msg: string =
        'I just joined the waitlist for Project Workflows, an upcoming app that lets you collaborate more efficiently with people outside your organization. Read more at';
    public authPlan: string = 'Essential';
    public didClickResend = false;
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthenticationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.authPlan = params['plan'] || 'Essential';
        });

        this.authService.$user.subscribe(user => {
            const isUserEmailVerified = user?.emailVerified;
            if (isUserEmailVerified) {
                this.router.navigate(['/project']);
            }
        });
    }

    public async resendVerificationEmail() {
        this.didClickResend = true;
        await this.authService.sendVerificationEmail();
    }
}
