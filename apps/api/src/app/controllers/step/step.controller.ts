import { Body, Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { Project, Step, StepDTO } from '@stepflow/interfaces';
import { FirebaseService } from '../../services/firebase.service';

@Controller('step')
export class StepController {
    constructor(private firebaseService: FirebaseService) {}

    @Get()
    getStepById(@Req() req: any, @Body() body: StepDTO): Step {
        console.log(req);
        console.log(body);

        return ({} as unknown) as Step;
    }

    @Post()
    createStep() {
        return 'Step created';
    }

    @Delete()
    deleteStep() {
        return 'Step deleted';
    }

    @Patch()
    updateStep() {
        return 'Update Step';
    }
}
