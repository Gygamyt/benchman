import { OmitType } from '@nestjs/swagger';
import { Request } from '../entities/request.entity';

export class CreateRequestDto extends OmitType(Request, [
    '_id',
    'requestId',
    'createdAt',
    'updatedAt',
] as const) {}
