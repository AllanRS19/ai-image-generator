import { IsString, MinLength } from 'class-validator';
import { ListFeedDto } from './list-feed.dto';

export class SearchFeedDto extends ListFeedDto {
  @IsString()
  @MinLength(1)
  q!: string;
}
