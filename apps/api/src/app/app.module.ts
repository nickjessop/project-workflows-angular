import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProjectController } from './controllers/project/project.controller';
import { UserController } from './controllers/user/user.controller';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { FirebaseService } from './services/firebase/firebase.service';

@Module({
    imports: [],
    controllers: [AppController, ProjectController, UserController],
    providers: [FirebaseService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes('project', 'user');
    }
}
