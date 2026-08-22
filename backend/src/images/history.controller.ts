import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ImagesService } from './images.service';
import { ListFeedDto } from './dto/list-feed.dto';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  list(@Query() query: ListFeedDto, @CurrentUser() user: User) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.imagesService.findByAuthor(user.id, page, limit);
  }
}
