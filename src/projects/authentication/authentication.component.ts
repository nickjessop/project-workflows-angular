import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    public loginForm: FormGroup;

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.loginForm = this.formBuilder.group({ username: '', password: '' });
    }

    ngOnInit() {}

    public login(formField: { username: string; password: string }) {
        this.authenticationService.login(formField.username, formField.password);
    }
}
