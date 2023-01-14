import { Injectable } from '@angular/core';
import { Project } from '@stepflow/interfaces';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectApiService {
    constructor(private apiService: ApiService) {}

    public async getAllProjects() {
        const projects = await this.apiService.get('project');

        console.log(projects);
    }
}
