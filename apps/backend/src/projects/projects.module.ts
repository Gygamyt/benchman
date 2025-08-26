import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Project.name, schema: ProjectSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
})
export class ProjectsModule {}
