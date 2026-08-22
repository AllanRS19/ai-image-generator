import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InferenceClient } from '@huggingface/inference';

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string | null;
  guidance: number;
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
    try {
      const imageBlob = await this.client.textToImage(
        {
          model: this.model,
          inputs: params.prompt,
          provider: 'auto',
          parameters: {
            negative_prompt: params.negativePrompt ?? undefined,
            guidance_scale: params.guidance,
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
}
