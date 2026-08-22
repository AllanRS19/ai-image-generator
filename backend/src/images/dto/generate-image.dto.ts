import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ImageResolution } from '../entities/image.entity';

export class GenerateImageDto {
  @IsString()
  @MinLength(3)
  prompt!: string;

  @IsOptional()
  @IsString()
  negativePrompt?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsEnum(ImageResolution)
  resolution!: ImageResolution;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  guidance?: number;
}
