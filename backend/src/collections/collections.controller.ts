import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SaveImageDto } from './dto/save-image.dto';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() dto: CreateCollectionDto, @CurrentUser() user: User) {
    return this.collectionsService.createCollection(user.id, dto.name);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.collectionsService.findUserCollections(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.collectionsService.findOwnedCollection(user.id, id);
  }

  @Post(':id/images')
  addImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SaveImageDto,
    @CurrentUser() user: User,
  ) {
    return this.collectionsService.addImage(user.id, id, dto.imageId);
  }

  @Delete(':id/images/:imageId')
  removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @CurrentUser() user: User,
  ) {
    return this.collectionsService.removeImage(user.id, id, imageId);
  }
}
