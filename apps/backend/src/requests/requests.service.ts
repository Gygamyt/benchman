import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request, RequestDocument } from './entities/request.entity';
import { FindAllRequestsDto } from './dto/find-all-requests.dto';

@Injectable()
export class RequestsService {
  constructor(
      @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<Request> {
    const createdRequest = await this.requestModel.create(createRequestDto);
    return createdRequest.toObject();
  }

  async findAll(query?: FindAllRequestsDto): Promise<Request[]> {
    const filter: FilterQuery<RequestDocument> = {};

    if (query?.name) filter.name = { $regex: new RegExp(query.name, 'i') };
    if (query?.status) filter.status = query.status;
    if (query?.projectStatus) filter.projectStatus = query.projectStatus;

    // Для поиска по вложенным полям используется "dot notation"
    if (query?.grade) {
      filter['staffing.grade'] = query.grade;
    }

    return this.requestModel.find(filter).lean().exec();
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestModel.findById(id).lean().exec();
    if (!request) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
    const updatedRequest = await this.requestModel
        .findByIdAndUpdate(id, updateRequestDto, { new: true })
        .lean()
        .exec();

    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
    return updatedRequest;
  }

  async remove(id: string): Promise<void> {
    const result = await this.requestModel.findByIdAndDelete(id).lean().exec();
    if (!result) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
  }
}
