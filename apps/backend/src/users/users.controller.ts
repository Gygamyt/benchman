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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create')
    @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: () => User })
    @ApiBody({ type: () => CreateUserDto })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Post('batch')
    @ApiResponse({ status: 201, description: 'A batch of users has been successfully created.', type: [() => User] })
    @ApiBody({ type: [CreateUserDto] })
    createBatch(@Body() createUsersDto: CreateUserDto[]): Promise<User[]> {
        return this.usersService.createMany(createUsersDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all users.', type: [() => User] })
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Returns a filtered list of users.', type: [() => User] })
    @ApiBody({ type: () => FindAllUsersDto })
    searchUsers(@Body() query: FindAllUsersDto): Promise<User[]> {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'The ID of the user' })
    @ApiResponse({ status: 200, description: 'Returns a single user.', type: () => User })
    @ApiResponse({ status: 404, description: 'User not found.' })
    findByID(@Param('id') id: string): Promise<User> {
        return this.usersService.findByID(id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', description: 'The ID of the user' })
    @ApiBody({ type: () => UpdateUserDto })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: () => User })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', description: 'The ID of the user' })
    @ApiResponse({ status: 204, description: 'The user has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
