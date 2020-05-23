import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { ComponentType, FieldConfig } from '../../models/interfaces/core-component';
import { Validators } from '@angular/forms';
import { DynamicFormComponent } from '../../core/components/dynamic-form/dynamic-form.component';
import { ProjectService } from '../../services/project/project.service';
import { Subscription } from 'rxjs';
import { Project } from '../../models/interfaces/project';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
    @ViewChild(DynamicFormComponent, { static: false }) form: any;
    @Input() isNewProject = true;

    private projectConfigSubscription: Subscription = new Subscription();
    private projectConfig: Project = this.projectService.createBaseProject();

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.initProject(this.isNewProject);
    }

    private initProject(isNewProject: boolean) {
        this.projectConfigSubscription = this.projectService.projectConfig$.subscribe(projectConfig => {
            this.projectConfig = projectConfig;
        });

        if (isNewProject) {
            this.projectService.createNewProject(true);
        }
    }

    ngOnDestroy() {
        if (this.projectConfigSubscription) {
            this.projectConfigSubscription.unsubscribe();
        }
    }

    onFormSubmit(event: Event) {
        console.log('form submitted!');
        event.preventDefault();
        event.stopPropagation();
    }
}
