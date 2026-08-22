import { Controller, Get, Query } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ListFeedDto } from './dto/list-feed.dto';
import { SearchFeedDto } from './dto/search-feed.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  list(@Query() query: ListFeedDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.imagesService.findFeed(page, limit);
  }

  @Get('search')
  search(@Query() query: SearchFeedDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.imagesService.searchFeed(query.q, page, limit);
  }
}
