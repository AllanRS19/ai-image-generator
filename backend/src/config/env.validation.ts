import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  Min,
  Max,
  validateSync,
  IsUrl,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT!: number;

  @IsString()
  CORS_ORIGIN!: string;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  GITHUB_CLIENT_ID!: string;

  @IsString()
  GITHUB_CLIENT_SECRET!: string;

  @IsUrl({ require_tld: false })
  GITHUB_CALLBACK_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN!: string;

  @IsString()
  REDIS_URL!: string;

  @IsString()
  HUGGING_FACE_API_TOKEN!: string;

  @IsString()
  HUGGING_FACE_MODEL!: string;

  @IsString()
  CLOUDINARY_CLOUD_NAME!: string;

  @IsString()
  CLOUDINARY_API_KEY!: string;

  @IsString()
  CLOUDINARY_API_SECRET!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((err) => Object.values(err.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Config validation error: ${messages}`);
  }

  return validatedConfig;
}
