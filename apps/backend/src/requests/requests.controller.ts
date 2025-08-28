import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseBoolPipe } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ApiBody, ApiParam, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllRequestsDto } from './dto/find-all-requests.dto';
import { Request } from './entities/request.entity';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { AssignProjectDto } from './dto/assign-project.dto';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Request created.', type: () => Request })
    @ApiBody({ type: () => CreateRequestDto })
    create(@Body() createRequestDto: CreateRequestDto) {
        return this.requestsService.create(createRequestDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all requests.', type: [() => Request] })
    findAll(@Query() query: FindAllRequestsDto) {
        return this.requestsService.findAll(query);
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Returns a filtered list of requests.', type: [() => Request] })
    @ApiBody({ type: () => FindAllRequestsDto })
    search(@Body() query: FindAllRequestsDto) {
        return this.requestsService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'Request ID' })
    @ApiPropertyOptional({ name: 'populate', type: Boolean, description: 'Populate related fields' })
    @ApiResponse({ status: 200, description: 'Returns a single request.', type: () => Request })
    findOne(@Param('id') id: string, @Query('populate', new ParseBoolPipe({ optional: true })) populate?: boolean) {
        return this.requestsService.findOne(id, populate);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', description: 'Request ID' })
    @ApiBody({ type: () => UpdateRequestDto })
    @ApiResponse({ status: 200, description: 'Request updated.', type: () => Request })
    update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
        return this.requestsService.update(id, updateRequestDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', description: 'Request ID' })
    @ApiResponse({ status: 204, description: 'Request deleted.' })
    remove(@Param('id') id: string) {
        return this.requestsService.remove(id);
    }

    @Post(':requestId/employees')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Assigns an employee to the request.' })
    @ApiParam({ name: 'requestId', description: 'The ID of the request' })
    @ApiBody({ type: AssignEmployeeDto })
    assignEmployee(@Param('requestId') requestId: string, @Body() assignEmployeeDto: AssignEmployeeDto) {
        return this.requestsService.assignEmployee(requestId, assignEmployeeDto.employeeId);
    }

    @Delete(':requestId/employees/:employeeId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204, description: 'Removes an employee from the request.' })
    @ApiParam({ name: 'requestId', description: 'The ID of the request' })
    @ApiParam({ name: 'employeeId', description: 'The ID of the employee' })
    removeEmployee(@Param('requestId') requestId: string, @Param('employeeId') employeeId: string) {
        return this.requestsService.removeEmployee(requestId, employeeId);
    }

    @Post(':requestId/projects')
    @HttpCode(HttpStatus.OK)
    assignProject(@Param('requestId') requestId: string, @Body() assignProjectDto: AssignProjectDto) {
        return this.requestsService.assignProject(requestId, assignProjectDto.projectId);
    }

    @Delete(':requestId/projects/:projectId')
    @HttpCode(HttpStatus.NO_CONTENT)
    removeProject(@Param('requestId') requestId: string, @Param('projectId') projectId: string) {
        return this.requestsService.removeProject(requestId, projectId);
    }
}
