import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
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
}
