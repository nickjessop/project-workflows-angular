import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlockController } from './controllers/block/block.controller';
import { ProjectController } from './controllers/project/project.controller';
import { StepController } from './controllers/step/step.controller';
import { UserController } from './controllers/user/user.controller';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { FirebaseService } from './services/firebase.service';

@Module({
    imports: [],
    controllers: [AppController, ProjectController, UserController, StepController, BlockController],
    providers: [FirebaseService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(ProjectController, UserController, StepController, BlockController);
    }
}
