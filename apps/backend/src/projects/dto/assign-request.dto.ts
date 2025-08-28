import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignRequestDto {
    @ApiProperty({ description: 'The ID of the request to link' })
    @IsMongoId()
    @IsNotEmpty()
    requestId!: string;
}
