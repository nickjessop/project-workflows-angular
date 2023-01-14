import * as amplitude from '@amplitude/analytics-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectApiService } from '../services/project/project-api.service';
import { ProjectService } from '../services/project/project.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
    public isLoadingProjects = true;
    public allProjects: { id: string; description: string; name: string; isOwner: boolean }[] = [];
    public myProjects: { id: string; description: string; name: string; isOwner: boolean }[] = [];
    public sharedProjects: { id: string; description: string; name: string }[] = [];

    constructor(
        private projectService: ProjectService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private messageService: MessageService,
        private projectApiService: ProjectApiService
    ) {}

    ngOnInit() {
        this.getProjects();
        this.projectApiService.getAllProjects();
        // this.apiService.testApi().subscribe();
    }

    public async getProjects() {
        this.isLoadingProjects = true;

        try {
            const allProjects = await this.projectService.getProjects();
            this.allProjects = allProjects.map(project => {
                return {
                    id: project.itemData.id!,
                    description: project.itemData.description,
                    name: project.itemData.name,
                    memberRoles: project.itemData.memberRoles,
                    isOwner: project.isOwner,
                };
            });
            this.myProjects = this.allProjects.filter(project => project.isOwner === true);
            this.sharedProjects = this.allProjects.filter(project => project.isOwner === false);
        } catch (error) {
            // TODO: handle error;
        }

        this.isLoadingProjects = false;
    }

    public onDeleteProject($event: { id: string }) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this project? This action cannot be undone.',
            accept: () => {
                this.projectService.deleteProject($event.id).then(
                    success => {
                        this.getProjects();
                    },
                    error => {
                        console.log(`Error deleting project ${$event.id}`);
                    }
                );
            },
        });
    }

    public async onCreateNewProjectEvent($event: { projectName: string; description: string }) {
        const newProject = await this.projectService.createNewProject($event.projectName, $event.description);
        if (newProject) {
            this.router.navigateByUrl(`/project/${newProject.id}`);
            amplitude.track('projects:project-create');
        } else if (newProject === false) {
            // exceed quota of 3
            this.messageService.add({
                key: 'global-toast',
                severity: 'error',
                detail: 'You may only create a max of 3 projects on your plan.',
            });
            amplitude.track('projects:quota-hit');
        } else {
            // error occurred during creation
            this.messageService.add({
                key: 'global-toast',
                severity: 'error',
                detail: 'An error occurred while attempting to create the project.  Please try again.',
            });
        }
    }
}
