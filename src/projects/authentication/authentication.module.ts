import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SignupComponent, LoginComponent, AuthenticationComponent],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [AuthenticationComponent],
})
export class AuthenticationModule {}
