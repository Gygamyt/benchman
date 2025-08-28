import { forwardRef, Module } from '@nestjs/common';
import { DictionaryModule } from '../dictionary/dictionary.module'; // <-- Импортируем
import { IsInDictionaryConstraint } from '../shared/validators/is-in-dictionary.validator';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './entities/request.entity';
import { RequestsService } from './requests.service';
import { Employee, EmployeeSchema } from '../employees/entities/employee.entity';
import { ProjectsModule } from '../projects/projects.module';
import { Project, ProjectSchema } from '../projects/entities/project.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Request.name, schema: RequestSchema },
            { name: Employee.name, schema: EmployeeSchema },
            { name: Project.name, schema: ProjectSchema },
        ]),
        DictionaryModule,
        forwardRef(() => ProjectsModule),
    ],
    controllers: [RequestsController],
    providers: [RequestsService, IsInDictionaryConstraint],
    exports: [RequestsService],
})
export class RequestsModule {}
