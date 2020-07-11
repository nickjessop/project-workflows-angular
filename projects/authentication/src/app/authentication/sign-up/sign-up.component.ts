import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    public registerForm: FormGroup;
    public formInputs = { email: '', password1: '', password2: '', name: '' };
    public registerError = '';

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
        this.registerForm = this.formBuilder.group(this.formInputs);
    }

    ngOnInit() {}

    public register(formValues: { email: string; password1: string; password2: string; name: string }) {
        const { email, password1, password2, name } = formValues;
        this.registerError = '';

        if (!this.validNameLength(name)) {
            this.registerError = 'Please enter your name.';
            return;
        }

        if (!this.validMatchingPasswords(password1, password2)) {
            this.registerError = 'Passwords do not match.';
            return;
        }

        if (!this.validPasswordLengths(password1, password2)) {
            this.registerError = 'Passwords should be at least 6 characters in length.';
            return;
        }

        this.authenticationService.register(email, password1).subscribe(
            firebaseCredential => {
                this.redirectToThankYouPage();
                console.log(firebaseCredential);
            },
            err => {
                console.log(`error: ${err}`);
                this.registerError = err;
            }
        );
    }

    private validMatchingPasswords(password1: string, password2: string) {
        return password1 === password2;
    }

    private validPasswordLengths(password1: string, password2: string) {
        return password1.length >= 6 && password2.length >= 6;
    }

    private validNameLength(name: string) {
        return name.length >= 1;
    }

    private redirectToThankYouPage() {
        const didRouteSuccessfully = this.router.navigate(['/thank-you']);

        return didRouteSuccessfully;
    }
}
