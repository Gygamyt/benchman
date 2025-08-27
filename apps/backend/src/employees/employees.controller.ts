import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post('create')
    @ApiResponse({ status: 201, description: 'The employee has been successfully created.', type: () => Employee })
    @ApiBody({ type: () => CreateEmployeeDto })
    create(@Body() createUserDto: CreateEmployeeDto): Promise<Employee> {
        return this.employeesService.create(createUserDto);
    }

    @Post('batch')
    @ApiResponse({ status: 201, description: 'A batch of employees has been successfully created.', type: [() => Employee] })
    @ApiBody({ type: [CreateEmployeeDto] })
    createBatch(@Body() createUsersDto: CreateEmployeeDto[]): Promise<Employee[]> {
        return this.employeesService.createMany(createUsersDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all employees.', type: [() => Employee] })
    findAll(): Promise<Employee[]> {
        return this.employeesService.findAll();
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Returns a filtered list of employees.', type: [() => Employee] })
    @ApiBody({ type: () => FindAllEmployeesDto })
    searchUsers(@Body() query: FindAllEmployeesDto): Promise<Employee[]> {
        return this.employeesService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'The ID of the employee' })
    @ApiResponse({ status: 200, description: 'Returns a single employee.', type: () => Employee })
    @ApiResponse({ status: 404, description: 'Employee not found.' })
    findByID(@Param('id') id: string): Promise<Employee> {
        return this.employeesService.findByID(id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', description: 'The ID of the employee' })
    @ApiBody({ type: () => UpdateEmployeeDto })
    @ApiResponse({ status: 200, description: 'The employee has been successfully updated.', type: () => Employee })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateEmployeeDto): Promise<Employee> {
        return this.employeesService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', description: 'The ID of the employee' })
    @ApiResponse({ status: 204, description: 'The employee has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<void> {
        return this.employeesService.remove(id);
    }
}
