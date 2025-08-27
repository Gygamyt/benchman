import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { Employee, EmployeeSchema } from '../employees/entities/employee.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Project.name, schema: ProjectSchema },
            { name: Employee.name, schema: EmployeeSchema },
        ]),
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectsModule {}
