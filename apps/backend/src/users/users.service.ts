import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-users.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    /**
     * Creates a single new user.
     * @param createUserDto - The data for creating the user.
     * @returns The created user as a plain object.
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = await this.userModel.create(createUserDto);
        return createdUser.toObject();
    }

    /**
     * Creates a batch of new users.
     * @param createUsersDto - An array of user data for creation.
     * @returns An array of created users as plain objects.
     */
    async createMany(createUsersDto: CreateUserDto[]): Promise<User[]> {
        const createdUsers = await this.userModel.insertMany(createUsersDto);
        return createdUsers.map(user => user.toObject());
    }

    /**
     * Finds users based on optional filter criteria.
     * @param query - The DTO containing filter parameters.
     * @returns A list of users.
     */
    async findAll(query?: FindAllUsersDto): Promise<User[]> {
        const filter: FilterQuery<UserDocument> = {};

        if (query?.status) filter.status = query.status;
        if (query?.grade) filter.grade = query.grade;
        if (query?.role) filter.role = query.role;
        if (query?.name) filter.name = { $regex: new RegExp(query.name, 'i') };
        if (query?.skills?.length) filter.skills = { $in: query.skills };

        if (query?.createdAfter || query?.createdBefore) {
            filter.createdAt = {};
            if (query.createdAfter) filter.createdAt.$gte = query.createdAfter;
            if (query.createdBefore) filter.createdAt.$lte = query.createdBefore;
        }

        return this.userModel.find(filter).lean().exec();
    }

    /**
     * Finds a single user by their ID.
     * @param id - The ID of the user to find.
     * @returns The found user.
     * @throws NotFoundException if the user is not found.
     */
    async findByID(id: string): Promise<User> {
        const user = await this.userModel.findById(id).lean().exec();
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    /**
     * Updates a user's data.
     * @param id - The ID of the user to update.
     * @param updateUserDto - The data to update.
     * @returns The updated user.
     * @throws NotFoundException if the user is not found.
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .lean()
            .exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return updatedUser;
    }

    /**
     * Removes a user from the database.
     * @param id - The ID of the user to remove.
     * @throws NotFoundException if the user is not found.
     */
    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).lean().exec();
        if (!result) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
    }
}
