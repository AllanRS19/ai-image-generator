import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { FeedController } from './feed.controller';
import { ImageController } from './image.controller';
import { HistoryController } from './history.controller';
import { HuggingFaceService } from './hugginface.service';
import {
  GENERATION_QUEUE,
  GenerationQueueService,
} from './queue/generation-queue.service';
import { GenerationProcessor } from './queue/generation.processor';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    BullModule.registerQueue({ name: GENERATION_QUEUE }),
    StorageModule,
  ],
  controllers: [
    ImagesController,
    FeedController,
    ImageController,
    HistoryController,
  ],
  providers: [
    ImagesService,
    HuggingFaceService,
    GenerationQueueService,
    GenerationProcessor,
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
