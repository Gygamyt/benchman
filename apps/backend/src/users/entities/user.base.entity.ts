import { ApiProperty } from '@nestjs/swagger';
import { UserGrade, UserStatus } from './user.enums';

export class UserBaseEntity {
    @ApiProperty({ example: 'Ivan Ivanov', description: 'The full name of the user' })
    name!: string;

    @ApiProperty({ example: 'QA Engineer', description: 'The user\'s role in the company' })
    role!: string;

    @ApiProperty({ enum: UserGrade, description: 'The user\'s grade level' })
    grade!: UserGrade;

    @ApiProperty({ enum: UserStatus, description: 'The user\'s current status' })
    status!: UserStatus;

    @ApiProperty({ type: [String], required: false, description: 'A list of user skills' })
    skills?: string[];

    @ApiProperty({ required: false, description: 'Link to the user\'s CV' })
    cvLink?: string;
}
