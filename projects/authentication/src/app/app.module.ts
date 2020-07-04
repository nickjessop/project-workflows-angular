import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { LoginComponent } from './authentication/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@NgModule({
    declarations: [AppComponent, AuthenticationComponent, SignUpComponent, LoginComponent, ThankYouComponent, NavBarComponent],
    imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
