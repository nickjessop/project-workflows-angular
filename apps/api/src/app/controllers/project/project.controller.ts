import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Project } from '@stepflow/interfaces';

@Controller('project')
export class ProjectController {
    @Get()
    getAllProjects(): Array<Project['id']> {
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
