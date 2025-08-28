import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { AssignRequestDto } from './dto/assign-request.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post('create')
    @ApiResponse({ status: 201, description: 'Project created.', type: () => Project })
    @ApiBody({ type: () => CreateProjectDto })
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of projects.', type: [() => Project] })
    findAll(@Query() query: FindAllProjectsDto) {
        return this.projectsService.findAll(query);
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Returns a filtered list of projects.', type: [() => Project] })
    @ApiBody({ type: () => FindAllProjectsDto })
    search(@Body() query: FindAllProjectsDto) {
        return this.projectsService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Returns a single project.', type: () => Project })
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiBody({ type: () => UpdateProjectDto })
    @ApiResponse({ status: 200, description: 'Project updated.', type: () => Project })
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: 204, description: 'Project deleted.' })
    remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }

    @Post(':projectId/employees')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Assigns an employee to the project.' })
    @ApiParam({ name: 'projectId', description: 'The ID of the project' })
    @ApiBody({ type: AssignEmployeeDto })
    assignEmployee(@Param('projectId') projectId: string, @Body() assignEmployeeDto: AssignEmployeeDto) {
        return this.projectsService.assignEmployee(projectId, assignEmployeeDto.employeeId);
    }

    @Delete(':projectId/employees/:employeeId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204, description: 'Removes an employee from the project.' })
    @ApiParam({ name: 'projectId', description: 'The ID of the project' })
    @ApiParam({ name: 'employeeId', description: 'The ID of the employee' })
    removeEmployee(@Param('projectId') projectId: string, @Param('employeeId') employeeId: string) {
        return this.projectsService.removeEmployee(projectId, employeeId);
    }

    @Post(':projectId/requests')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Links a request to the project.' })
    assignRequest(
        @Param('projectId') projectId: string,
        @Body() assignRequestDto: AssignRequestDto,
    ) {
        return this.projectsService.assignRequest(projectId, assignRequestDto.requestId);
    }

    @Delete(':projectId/requests/:requestId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204, description: 'Unlinks a request from the project.' })
    removeRequest(
        @Param('projectId') projectId: string,
        @Param('requestId') requestId: string,
    ) {
        return this.projectsService.removeRequest(projectId, requestId);
    }
}
