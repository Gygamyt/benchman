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
    Query,
    ParseBoolPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';
import { AssignRequestDto } from './dto/assign-request.dto';
import { AssignProjectDto } from './dto/assign-project.dto';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'The employee has been successfully created.', type: () => Employee })
    @ApiBody({ type: () => CreateEmployeeDto })
    create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return this.employeesService.create(createEmployeeDto);
    }

    @Post('batch')
    @ApiResponse({ status: 201, description: 'A batch of employees has been successfully created.', type: [() => Employee] })
    @ApiBody({ type: [CreateEmployeeDto] })
    createBatch(@Body() createEmployeesDto: CreateEmployeeDto[]): Promise<Employee[]> {
        return this.employeesService.createMany(createEmployeesDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all employees.', type: [() => Employee] })
    findAll(@Query() query: FindAllEmployeesDto): Promise<Employee[]> {
        return this.employeesService.findAll(query);
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
    findByID(
        @Param('id') id: string,
        @Query('populate', new ParseBoolPipe({ optional: true })) populate?: boolean,
    ): Promise<Employee> {
        return this.employeesService.findByID(id, populate);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', description: 'The ID of the employee' })
    @ApiBody({ type: () => UpdateEmployeeDto })
    @ApiResponse({ status: 200, description: 'The employee has been successfully updated.', type: () => Employee })
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        return this.employeesService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', description: 'The ID of the employee' })
    @ApiResponse({ status: 204, description: 'The employee has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<void> {
        return this.employeesService.remove(id);
    }

    @Post(':employeeId/requests')
    @HttpCode(HttpStatus.OK)
    assignRequest(
        @Param('employeeId') employeeId: string,
        @Body() assignRequestDto: AssignRequestDto,
    ) {
        return this.employeesService.assignRequest(employeeId, assignRequestDto.requestId);
    }

    @Delete(':employeeId/requests/:requestId')
    @HttpCode(HttpStatus.NO_CONTENT)
    removeRequest(
        @Param('employeeId') employeeId: string,
        @Param('requestId') requestId: string,
    ) {
        return this.employeesService.removeRequest(employeeId, requestId);
    }

    @Post(':employeeId/projects')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Assigns a project to the employee.' })
    assignProject(
        @Param('employeeId') employeeId: string,
        @Body() assignProjectDto: AssignProjectDto,
    ) {
        return this.employeesService.assignProject(employeeId, assignProjectDto.projectId);
    }

    @Delete(':employeeId/projects/:projectId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204, description: 'Removes a project from the employee.' })
    removeProject(
        @Param('employeeId') employeeId: string,
        @Param('projectId') projectId: string,
    ) {
        return this.employeesService.removeProject(employeeId, projectId);
    }
}
