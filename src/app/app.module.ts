import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProtectedRoutingModule } from './protected-routing.module';
import { CoreComponentsModule } from './core/core-components.module';
import { ProjectComponent } from './project/project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SliceEllipsisPipe } from './pipes/slice-ellipsis.pipe';
import { ComponentPlaygroundComponent } from './dashboard/component-playground/component-playground.component';
import { ViewerComponent } from './project/viewer/viewer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { StepsComponent } from './project/steps/steps.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        PageNotFoundComponent,
        ProjectComponent,
        ProjectCardComponent,
        SliceEllipsisPipe,
        ComponentPlaygroundComponent,
        ViewerComponent,
        NavBarComponent,
        StepsComponent,
    ],
    imports: [ProtectedRoutingModule, BrowserModule, AppRoutingModule, CoreComponentsModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
