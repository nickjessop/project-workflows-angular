import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FirebaseService } from '../services/firebase/firebase.service';
import { ProjectService } from '../services/project/project.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
    public isLoadingProjects = true;
    public projects: { id: string; description: string; name: string }[] = [];

    constructor(
        private projectService: ProjectService,
        private confirmationService: ConfirmationService,
        private firebaseService: FirebaseService
    ) {}

    ngOnInit() {
        this.getProjects();
    }

    public getProjects() {
        this.isLoadingProjects = true;

        this.projectService.getProjects().then(projects => {
            console.log(projects);

            // const projectSubdata = _projects.map(project => {
            //     return { id: project.id!, description: project.description, name: project.name };
            // });

            // this.projects = projectSubdata;

            this.isLoadingProjects = false;
        });

        // this.projectService.getProjects().subscribe(
        //     projects => {
        //         const _projects = projects.data as Project[];

        //         const projectSubdata = _projects.map(project => {
        //             return { id: project.id!, description: project.description, name: project.name };
        //         });

        //         this.projects = projectSubdata;

        //         this.isLoadingProjects = false;
        //     },
        //     error => {
        //         this.isLoadingProjects = false;
        //     }
        // );

        // this.projectService.getAllProjectIds().subscribe(
        //     projectDocument => {
        //         let _projects: { id: string; description: string; name: string }[] = [];

        //         projectDocument.forEach(projectDoc => {
        //             const projectData = projectDoc.data() as Project;
        //             _projects.push({
        //                 id: projectDoc.id,
        //                 description: projectData.description,
        //                 name: projectData.name,
        //             });
        //         });

        //         this.projects = _projects;
        //         this.isLoadingProjects = false;
        //     },
        //     err => {
        //         console.log(err);
        //         this.isLoadingProjects = false;
        //     }
        // );
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
