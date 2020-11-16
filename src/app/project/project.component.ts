import { Component, OnInit } from '@angular/core';
import { Project } from '../models/interfaces/project';
import { ProjectService } from '../services/project/project.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
    public isLoadingProjects = true;
    public projects: { id: string; description: string; name: string }[] = [];

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.getProjects();
    }

    public saveProject() {
        console.log('saving project test');

        this.projectService.saveDemoProject();
    }

    public updateProject() {
        console.log('updating project test');
    }

    public getProjects() {
        this.isLoadingProjects = true;

        this.projectService.getAllProjectIds().subscribe(
            projectDocument => {
                let _projects: { id: string; description: string; name: string }[] = [];

                projectDocument.forEach(projectDoc => {
                    const projectData = projectDoc.data() as Project;
                    _projects.push({
                        id: projectDoc.id,
                        description: projectData.description,
                        name: projectData.name,
                    });
                });

                this.projects = _projects;
                this.isLoadingProjects = false;
            },
            err => {
                console.log(err);
                this.isLoadingProjects = false;
            }
        );
    }
}
