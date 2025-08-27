import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllRequestsDto } from './dto/find-all-requests.dto';
import { Request } from './entities/request.entity';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Request created.', type: () => Request })
    @ApiBody({ type: () => CreateRequestDto })
    create(@Body() createRequestDto: CreateRequestDto) {
        return this.requestsService.create(createRequestDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Returns a list of all requests.', type: [() => Request] })
    findAll(@Query() query: FindAllRequestsDto) {
        return this.requestsService.findAll(query);
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Returns a filtered list of requests.', type: [() => Request] })
    @ApiBody({ type: () => FindAllRequestsDto })
    search(@Body() query: FindAllRequestsDto) {
        return this.requestsService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'Request ID' })
    @ApiResponse({ status: 200, description: 'Returns a single request.', type: () => Request })
    findOne(@Param('id') id: string) {
        return this.requestsService.findOne(id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', description: 'Request ID' })
    @ApiBody({ type: () => UpdateRequestDto })
    @ApiResponse({ status: 200, description: 'Request updated.', type: () => Request })
    update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
        return this.requestsService.update(id, updateRequestDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', description: 'Request ID' })
    @ApiResponse({ status: 204, description: 'Request deleted.' })
    remove(@Param('id') id: string) {
        return this.requestsService.remove(id);
    }
}
