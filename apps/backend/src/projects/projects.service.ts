import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';
import { Employee, EmployeeDocument } from '../employees/entities/employee.entity';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    ) {}

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const { team, ...projectData } = createProjectDto;

        const createdProject = await this.projectModel.create({
            ...projectData,
            team: team,
        });

        if (team && team.length > 0) {
            await this.employeeModel.updateMany({ _id: { $in: team } }, { $addToSet: { projects: createdProject._id } });
        }

        return createdProject.toObject();
    }

    async findAll(query?: FindAllProjectsDto): Promise<Project[]> {
        const filter: FilterQuery<ProjectDocument> = {};

        if (query?.status) filter.status = query.status;
        if (query?.domain) filter.domain = query.domain;

        if (query?.name) {
            filter.name = { $regex: new RegExp(query.name, 'i') };
        }

        if (query?.directions?.length) {
            filter.directions = { $in: query.directions };
        }
        if (query?.technologies?.length) {
            filter.technologies = { $in: query.technologies };
        }

        if (query?.teamMemberId) {
            filter.team = query.teamMemberId;
        }

        if (query?.createdAfter) {
            filter.createdAt = { $gte: query.createdAfter };
        }

        return this.projectModel.find(filter).populate('team').lean().exec();
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectModel.findById(id).populate('team').lean().exec();
        if (!project) {
            throw new NotFoundException(`Project with ID "${id}" not found`);
        }
        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
        // todo POST /projects/:id/team, DELETE /projects/:id/team/:employeeId
        const { team, ...projectData } = updateProjectDto;

        const updatedProject = await this.projectModel.findByIdAndUpdate(id, projectData, { new: true }).populate('team').lean().exec();

        if (!updatedProject) {
            throw new NotFoundException(`Project with ID "${id}" not found`);
        }
        return updatedProject;
    }

    async remove(id: string): Promise<void> {
        const projectToDelete = await this.projectModel.findByIdAndDelete(id).lean().exec();

        if (!projectToDelete) {
            throw new NotFoundException(`Project with ID "${id}" not found`);
        }

        if (projectToDelete.team && projectToDelete.team.length > 0) {
            await this.employeeModel.updateMany({ _id: { $in: projectToDelete.team } }, { $pull: { projects: projectToDelete._id } });
        }
    }

    /**
     * Assigns an employee to a project.
     */
    async assignEmployee(projectId: string, employeeId: string): Promise<void> {
        const project = await this.projectModel.findById(projectId);
        if (!project) throw new NotFoundException(`Project with ID "${projectId}" not found`);

        const employee = await this.employeeModel.findById(employeeId);
        if (!employee) throw new NotFoundException(`Employee with ID "${employeeId}" not found`);

        await project.updateOne({ $addToSet: { team: employeeId } });
        await employee.updateOne({ $addToSet: { projects: projectId } });
    }

    /**
     * Removes an employee from a project.
     */
    async removeEmployee(projectId: string, employeeId: string): Promise<void> {
        await this.projectModel.updateOne({ _id: projectId }, { $pull: { team: employeeId } });
        await this.employeeModel.updateOne({ _id: employeeId }, { $pull: { projects: projectId } });
    }
}
