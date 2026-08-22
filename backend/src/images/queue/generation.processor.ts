import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  GENERATION_QUEUE,
  GenerationJobData,
} from './generation-queue.service';
import { ImagesService } from '../images.service';
import { CloudinaryService } from '../../storage/cloudinary.service';
import { HuggingFaceService } from '../hugginface.service';

@Processor(GENERATION_QUEUE)
export class GenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerationProcessor.name);

  constructor(
    private readonly imagesService: ImagesService,
    private readonly huggingFaceService: HuggingFaceService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  async process(job: Job<GenerationJobData>): Promise<void> {
    const { imageId } = job.data;
    const image = await this.imagesService.findById(imageId);

    await this.imagesService.markProcessing(imageId);

    try {
      const buffer = await this.huggingFaceService.generateImage({
        prompt: image.prompt,
        negativePrompt: image.negativePrompt,
        guidance: image.guidance,
      });

      const imageUrl = await this.cloudinaryService.uploadImageBuffer(
        buffer,
        imageId,
      );

      await this.imagesService.markCompleted(imageId, imageUrl);
      this.logger.log(`Image ${imageId} generated successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.imagesService.markFailed(imageId, message);
      this.logger.error(`Image ${imageId} generation failed: ${message}`);
      throw error;
    }
  }
}
