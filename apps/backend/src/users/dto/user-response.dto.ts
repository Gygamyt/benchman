import { ApiProperty } from '@nestjs/swagger';
import { UserBaseEntity } from '../entities/user.base.entity';

export class UserResponseDto extends UserBaseEntity {
    @ApiProperty({ description: 'Unique user ID' })
    _id!: string;
}
