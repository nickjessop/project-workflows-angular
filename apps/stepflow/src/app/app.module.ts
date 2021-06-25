import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ConfirmationComponent } from './authentication/confirmation/confirmation.component';
import { CoreComponentsModule } from './core/core-components.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SliceEllipsisPipe } from './pipes/slice-ellipsis.pipe';
import { PrimengModule } from './primeng/primeng.module';
import { ProfileComponent } from './profile/profile.component';
import { BlockPanelOverlayComponent } from './project/block-overlay/block-overlay.component';
import { ControlsComponent } from './project/controls/controls.component';
import { NewProjectDialogComponent } from './project/new-project-dialog/new-project-dialog.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { ProjectComponent } from './project/project.component';
import { StepDialogComponent } from './project/step-dialog/step-dialog.component';
import { StepsComponent } from './project/steps/steps.component';
import { ViewerComponent } from './project/viewer/viewer.component';
import { ProtectedRoutingModule } from './protected-routing.module';
import { ApiService } from './services/api/api.service';
import { ShareComponent } from './project/share/share.component';

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        ProjectComponent,
        ProjectCardComponent,
        SliceEllipsisPipe,
        ViewerComponent,
        NavBarComponent,
        StepsComponent,
        ControlsComponent,
        BlockPanelOverlayComponent,
        StepDialogComponent,
        NewProjectDialogComponent,
        ProfileComponent,
        AuthenticationComponent,
        ConfirmationComponent,
        ShareComponent,
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
        DragDropModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
    exports: [SliceEllipsisPipe],
})
export class AppModule {}
