import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectController } from './controllers/project/project.controller';
import { UserController } from './controllers/user/user.controller';

@Module({
    imports: [],
    controllers: [AppController, ProjectController, UserController],
    providers: [AppService],
})
export class AppModule {}
