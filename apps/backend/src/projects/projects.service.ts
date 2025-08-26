import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const { team, ...projectData } = createProjectDto;

        const createdProject = await this.projectModel.create({
            ...projectData,
            team: team, // Mongoose сам преобразует строки ID в ObjectId
        });

        // Если в проекте есть команда, обновляем каждого пользователя
        if (team && team.length > 0) {
            await this.userModel.updateMany(
                { _id: { $in: team } },
                { $addToSet: { projects: createdProject._id } }, // $addToSet добавляет, только если еще нет
            );
        }

        return createdProject.toObject();
    }

    async findAll(query?: FindAllProjectsDto): Promise<Project[]> {
        const filter: FilterQuery<ProjectDocument> = {};
        if (query?.name) filter.name = { $regex: new RegExp(query.name, 'i') };
        if (query?.status) filter.status = query.status;
        if (query?.directions?.length) filter.directions = { $in: query.directions };

        // .populate('team') автоматически подтянет полные данные о пользователях в команде
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
        // Логика обновления команды сложна (нужно найти удаленных/добавленных),
        // пока реализуем простое обновление основных полей.
        // Для обновления команды лучше сделать отдельные эндпоинты, например:
        // POST /projects/:id/team, DELETE /projects/:id/team/:userId
        const { team, ...projectData } = updateProjectDto;

        const updatedProject = await this.projectModel
            .findByIdAndUpdate(id, projectData, { new: true })
            .populate('team')
            .lean()
            .exec();

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

        // Удаляем ссылку на этот проект у всех пользователей, которые в нем состояли
        if (projectToDelete.team && projectToDelete.team.length > 0) {
            await this.userModel.updateMany(
                { _id: { $in: projectToDelete.team } },
                { $pull: { projects: projectToDelete._id } },
            );
        }
    }
}