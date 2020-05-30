import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditComponent } from './project/edit/edit.component';
import { ViewComponent } from './project/view/view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ProtectedRoutingModule } from './protected-routing.module';
import { CoreComponentsModule } from './core/core-components.module';
import { ProjectComponent } from './project/project.component';
import { StepComponent } from './project/steps/step/step.component';
import { StepsComponent } from './project/steps/steps.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SideBarComponent } from './dashboard/side-bar/side-bar.component';
import { SliceEllipsisPipe } from './pipes/slice-ellipsis.pipe';
import { ProjectCardComponent } from './dashboard/project-card/project-card.component';
import { ComponentPlaygroundComponent } from './dashboard/component-playground/component-playground.component';
import { SideBarItemComponent } from './dashboard/side-bar/side-bar-item/side-bar-item.component';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
    declarations: [
        AppComponent,
        EditComponent,
        ViewComponent,
        StepComponent,
        StepsComponent,
        DashboardComponent,
        PageNotFoundComponent,
        ProjectComponent,
        SideBarComponent,
        ProjectCardComponent,
        SliceEllipsisPipe,
        ComponentPlaygroundComponent,
        SideBarItemComponent,
    ],
    imports: [
        AuthenticationModule,
        AuthenticationRoutingModule,
        ProtectedRoutingModule,
        BrowserModule,
        AppRoutingModule,
        CoreComponentsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
