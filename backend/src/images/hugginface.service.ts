import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InferenceClient } from '@huggingface/inference';
import { ImageResolution } from './entities/image.entity';

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string | null;
  guidance: number;
  resolution: ImageResolution;
}

@Injectable()
export class HuggingFaceService {
  private readonly client: InferenceClient;
  private readonly model: string;

  constructor(configService: ConfigService) {
    const token = configService.getOrThrow<string>('HUGGING_FACE_API_TOKEN');
    this.model = configService.getOrThrow<string>('HUGGING_FACE_MODEL');
    this.client = new InferenceClient(token);
  }

  async generateImage(params: GenerationParams): Promise<Buffer> {
    const { width, height } = this.parseResolution(params.resolution);

    try {
      const imageBlob = await this.client.textToImage(
        {
          model: this.model,
          inputs: params.prompt,
          provider: 'auto',
          parameters: {
            negative_prompt: params.negativePrompt ?? undefined,
            guidance_scale: params.guidance,
            width,
            height,
          },
        },
        { outputType: 'blob' },
      );

      const arrayBuffer = await imageBlob.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Hugging Face image generation failed: ${message}`);
    }
  }

  private parseResolution(resolution: ImageResolution): {
    width: number;
    height: number;
  } {
    const [width, height] = resolution.split('x').map(Number);
    return { width, height };
  }
}
