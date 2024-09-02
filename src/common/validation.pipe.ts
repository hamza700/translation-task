import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Check if 'words' exists, is an array, and is not empty
    if (
      !value.words ||
      !Array.isArray(value.words) ||
      value.words.length === 0
    ) {
      throw new BadRequestException('Words array must not be empty');
    }

    // Check if 'targetLanguage' exists and is a string
    if (!value.targetLanguage || typeof value.targetLanguage !== 'string') {
      throw new BadRequestException('Target language must be specified');
    }

    return value; // If validation passes, return the value unchanged
  }
}
