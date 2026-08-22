import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const GENERATION_QUEUE = 'image-generation';

export interface GenerationJobData {
  imageId: string;
}

@Injectable()
export class GenerationQueueService {
  constructor(
    @InjectQueue(GENERATION_QUEUE)
    private readonly generationQueue: Queue<GenerationJobData>,
  ) {}

  async enqueue(imageId: string): Promise<void> {
    await this.generationQueue.add(
      'generate',
      { imageId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
