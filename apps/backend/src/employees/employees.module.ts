import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { RequestsModule } from '../requests/requests.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]), RequestsModule],
    controllers: [EmployeesController],
    providers: [EmployeesService],
})
export class EmployeesModule {}
