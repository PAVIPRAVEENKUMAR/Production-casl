import {Controller,Get,Post,Body,Param,Delete,Put,UseGuards,Request} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/Create-item.dto';
import { UpdateItemDto } from './dto/Update-item.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CaslBaseGuard } from '../authz/casl.base.guard';
import { SetPermissions } from '../shared/decorators/set-permissions.decorator';
import { Action } from '../shared/enums/enums';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from './interfaces/auth.interface';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission.' })
  @ApiBody({ type: CreateItemDto, description: 'Item details to create' })
  @SetPermissions(Action.Create, 'Item')
  @UseGuards(CaslBaseGuard)
  async create(@Body() createItemDto: CreateItemDto, @Request() req:AuthenticatedRequest) {
    return this.itemsService.create(createItemDto, req.user.userId);
  }

  @Get()
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of all items' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission.' })
  @SetPermissions(Action.Read, 'Item')
  @UseGuards(CaslBaseGuard)
  async findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get a specific item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the item to retrieve' })
  @ApiResponse({ status: 200, description: 'The item details' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission.' })
  @SetPermissions(Action.Read, 'Item')
  @UseGuards(CaslBaseGuard)
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Update an item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the item to update' })
  @ApiBody({ type: UpdateItemDto, description: 'Item details to update' })
  @ApiResponse({ status: 200, description: 'The updated item details' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission.' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @SetPermissions(Action.Update, 'Item')
  @UseGuards(CaslBaseGuard)
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.itemsService.update(id, updateItemDto, req.user.userId);
  }

  @Delete(':id')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the item to delete' })
  @ApiResponse({ status: 200, description: 'The item has been deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission.' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @SetPermissions(Action.Delete, 'Item')
  @UseGuards(CaslBaseGuard)
  async remove(@Param('id') id: string,@Request() req: AuthenticatedRequest) {
    await this.itemsService.remove(id, req.user.userId);
    return { message: 'Item deleted successfully' };
  }
}
