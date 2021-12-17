import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../services/api/api.service';
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
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.getProjects();
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
            message: 'Are you sure you want to delete this project?',
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

    public onCreateNewProjectEvent($event: { projectName: string; description: string }) {
        this.projectService.createNewProject($event.projectName, $event.description).then(
            success => {
                this.getProjects();
            },
            error => {
                console.log('Error creating new project');
            }
        );
    }
}
