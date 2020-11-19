import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreComponentsModule } from './core/core-components.module';
import { ComponentPlaygroundComponent } from './dashboard/component-playground/component-playground.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SliceEllipsisPipe } from './pipes/slice-ellipsis.pipe';
import { PrimengModule } from './primeng/primeng.module';
import { BlockPanelOverlayComponent } from './project/block-overlay/block-overlay.component';
import { ControlsComponent } from './project/controls/controls.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { ProjectComponent } from './project/project.component';
import { StepDialogComponent } from './project/step-dialog/step-dialog.component';
import { StepsComponent } from './project/steps/steps.component';
import { ViewerComponent } from './project/viewer/viewer.component';
import { ProtectedRoutingModule } from './protected-routing.module';
import { ProjectControlsComponent } from './project/project-controls/project-controls.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

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
        ControlsComponent,
        BlockPanelOverlayComponent,
        StepDialogComponent,
        ProjectControlsComponent,
        UserMenuComponent,
    ],
    imports: [
        ProtectedRoutingModule,
        BrowserModule,
        AppRoutingModule,
        CoreComponentsModule,
        ReactiveFormsModule,
        PrimengModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
