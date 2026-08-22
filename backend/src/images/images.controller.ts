import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ImagesService } from './images.service';
import { GenerationQueueService } from './queue/generation-queue.service';
import { GenerateImageDto } from './dto/generate-image.dto';

@Controller('generate')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly generationQueueService: GenerationQueueService,
  ) {}

  @Post()
  async generate(@Body() dto: GenerateImageDto, @CurrentUser() user: User) {
    const image = await this.imagesService.createPending(user.id, dto);
    await this.generationQueueService.enqueue(image.id);
    return image;
  }
}
