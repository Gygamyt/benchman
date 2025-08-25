import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    // Приватный метод для преобразования сущности в DTO
    private mapToResponseDto(user: UserDocument): UserResponseDto {
        return {
            _id: user._id.toHexString(),
            name: user.name,
            role: user.role,
            grade: user.grade,
            status: user.status,
            skills: user.skills,
            cvLink: user.cvLink,
        };
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const createdUser = await this.userModel.create(createUserDto);
        return this.mapToResponseDto(createdUser);
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => this.mapToResponseDto(user));
    }

    async findOne(id: string): Promise<UserResponseDto> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return this.mapToResponseDto(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return this.mapToResponseDto(updatedUser);
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
    }
}
