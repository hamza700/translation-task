import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { ValidationPipe } from 'src/common/validation.pipe';

interface TranslateRequestBody {
  words: string[];
  targetLanguage: string;
}

interface TranslateResponseBody {
  words: { originalWord: string; translatedWord: string }[];
  targetLanguage: string;
}

@Controller('translate')
export class TranslateController {
  private readonly logger = new Logger(TranslateController.name); // Using NestJS built-in Logger

  constructor(private readonly translateService: TranslateService) {}

  @Post()
  async translate(
    @Body(new ValidationPipe()) body: TranslateRequestBody,
  ): Promise<TranslateResponseBody> {
    try {
      this.logger.verbose('Received translation request'); // Log request received

      const { words, targetLanguage } = body;
      const translatedWords = await this.translateService.translateWords(
        words,
        targetLanguage,
      );

      this.logger.verbose('Translation completed successfully'); // Log success
      return { words: translatedWords, targetLanguage };
    } catch (error) {
      this.logger.error('Translation Error:', error.message); // Log error
      throw error;
    }
  }
}
