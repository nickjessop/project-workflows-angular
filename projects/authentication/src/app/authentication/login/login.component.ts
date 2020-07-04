import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public formInputs = { email: '', password: '' };
    public loginError = '';

    constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {
        this.loginForm = this.formBuilder.group(this.formInputs);
    }

    ngOnInit() {}

    public login(formInputs: { email: string; password: string }) {
        const { email, password } = formInputs;

        this.loginError = '';

        if (!this.validEmailAndPassword(email, password)) {
            this.loginError = 'Please enter both email and password.';
            return;
        }

        this.authenticationService.login(email, password).subscribe(userCredential => {});
    }

    private validEmailAndPassword(email: string, password: string) {
        if (!email || !password) {
            return false;
        }

        return true;
    }
}
