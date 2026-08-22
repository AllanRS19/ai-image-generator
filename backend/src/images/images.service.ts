import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image, ImageStatus } from './entities/image.entity';
import { GenerateImageDto } from './dto/generate-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepo: Repository<Image>,
  ) {}

  createPending(authorId: string, dto: GenerateImageDto): Promise<Image> {
    const seed = this.generateSeed();

    const image = this.imagesRepo.create({
      authorId,
      prompt: dto.prompt,
      negativePrompt: dto.negativePrompt ?? null,
      color: dto.color ?? null,
      resolution: dto.resolution,
      guidance: dto.guidance ?? 7.5,
      seed,
      status: ImageStatus.PENDING,
    });

    return this.imagesRepo.save(image);
  }

  async findById(id: string): Promise<Image> {
    const image = await this.imagesRepo.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!image) {
      throw new NotFoundException(`Image ${id} not found`);
    }

    return image;
  }

  async markProcessing(id: string): Promise<void> {
    await this.imagesRepo.update(id, { status: ImageStatus.PROCESSING });
  }

  async markCompleted(id: string, imageUrl: string): Promise<void> {
    await this.imagesRepo.update(id, {
      status: ImageStatus.COMPLETED,
      imageUrl,
    });
  }

  async markFailed(id: string, reason: string): Promise<void> {
    await this.imagesRepo.update(id, {
      status: ImageStatus.FAILED,
      failureReason: reason,
    });
  }

  private generateSeed(): string {
    // Fits comfortably within Postgres bigint range.
    return Math.floor(Math.random() * 1_000_000_000_000).toString();
  }
}
