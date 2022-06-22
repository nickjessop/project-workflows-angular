import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ProjectService } from '../services/project/project.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
    public isLoadingProjects = true;
    public allProjects?: Array<{ id: string; description?: string; name?: string; isOwner: boolean }>;
    public myProjects?: Array<{ id: string; description?: string; name?: string; isOwner: boolean }>;
    public sharedProjects?: Array<{ id: string; description?: string; name?: string }>;

    constructor(
        private projectService: ProjectService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getProjects();
        // this.apiService.testApi().subscribe();
    }

    public async getProjects() {
        this.isLoadingProjects = true;
        const allProjects = await this.projectService.getProjects();

        if (!allProjects) {
            this.isLoadingProjects = false;
            return;
        }

        this.allProjects = allProjects?.map(proj => {
            return {
                id: proj.id!,
                description: proj.description,
                name: proj.name,
                isOwner: proj.isOwner,
            };
        });

        this.myProjects = this.allProjects?.filter(project => project.isOwner === true);
        this.sharedProjects = this.allProjects?.filter(project => project.isOwner === false);
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
        const newProjectId = await this.projectService.createNewProject($event.projectName, $event.description);

        if (newProjectId) {
            this.router.navigateByUrl(`/project/${newProjectId}`);
        }
        // this.projectService.createNewProject($event.projectName, $event.description).then(
        //     success => {
        //         this.getProjects();
        //     },
        //     error => {
        //         console.log('Error creating new project');
        //     }
        // );
    }
}
