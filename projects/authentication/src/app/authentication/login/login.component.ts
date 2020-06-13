import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public formInputs = { email: '', password: '' };

    constructor(private formBuilder: FormBuilder) {
        this.loginForm = this.formBuilder.group(this.formInputs);
    }

    ngOnInit() {}

    public login() {
        console.log('Login pressed');
    }
}
