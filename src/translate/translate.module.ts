import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';

@Module({
  imports: [HttpModule], // Import the HttpModule
  controllers: [TranslateController], // Add TranslateController to the controllers array
  providers: [TranslateService], // Add TranslateService to the providers array
})
export class TranslateModule {}
