import { Controller, Get } from '@nestjs/common';

@Controller('project')
export class ProjectController {
    @Get()
    test(): string {
        return 'Testing was successful!!!';
    }
}
