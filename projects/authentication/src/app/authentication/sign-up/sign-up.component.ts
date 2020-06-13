import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    public registerForm: FormGroup;
    public formInputs = { email: '', password1: '', password2: '', name: '' };

    constructor(private formBuilder: FormBuilder) {
        this.registerForm = this.formBuilder.group(this.formInputs);
    }

    ngOnInit() {}

    public register() {
        console.log('Registered pressed');
    }
}
