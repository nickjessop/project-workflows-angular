import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Project } from '@stepflow/interfaces';
import { FirebaseService } from '../../services/firebase.service';

@Controller('project')
export class ProjectController {
    constructor(private firebaseService: FirebaseService) {}

    @Get()
    getAllProjects(): Array<Project['id']> {
        // this.firebaseService

        return [''];
    }

    @Get(':id')
    getProjectById(): Project {
        return ({} as unknown) as Project;
    }

    @Post()
    createProject() {
        return 'createProject';
    }

    @Delete()
    deleteProject() {
        return 'deleteProject';
    }

    @Patch()
    updateProject() {
        return 'updateProject';
    }
}
