import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.findById(id);
  }
}
