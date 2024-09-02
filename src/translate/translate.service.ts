import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as spellchecker from 'spellchecker';
import * as isWord from 'is-word';

@Injectable()
export class TranslateService {
  private dictionary: any;
  private readonly logger = new Logger(TranslateService.name); // Using NestJS built-in Logger

  constructor(private httpService: HttpService) {
    this.dictionary = isWord('british-english'); // Load English dictionary
  }

  cleanWords(words: string[]): string[] {
    this.logger.verbose('Cleaning words...'); // Log verbose message

    const validWords = [];

    words.forEach((word) => {
      const cleanedWord = word.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters

      if (!cleanedWord) {
        // Check if word is empty after cleaning
        this.logger.verbose(`Word "${word}" was discarded after cleaning.`);
        return;
      }

      if (!this.dictionary.check(cleanedWord.toLowerCase())) {
        // Check if word is in the dictionary
        this.logger.verbose(
          `Word "${cleanedWord}" is not a valid English word.`,
        );
        return;
      }

      if (spellchecker.isMisspelled(cleanedWord)) {
        // Check if word is misspelled
        const corrections =
          spellchecker.getCorrectionsForMisspelling(cleanedWord);
        if (corrections.length > 0) {
          this.logger.verbose(
            `Word "${cleanedWord}" was corrected to "${corrections[0]}".`,
          );
          validWords.push(corrections[0]);
        } else {
          this.logger.warn(
            `No corrections found for misspelled word "${cleanedWord}".`,
          );
        }
      } else {
        validWords.push(cleanedWord); // Add valid word to the list
      }
    });

    const uniqueWords = [...new Set(validWords)]; // Remove duplicates
    const duplicatesRemoved = validWords.length - uniqueWords.length; // Calculate duplicates removed

    this.logger.verbose(
      `Total valid words after cleaning: ${validWords.length}`,
    );
    this.logger.verbose(`Duplicates removed: ${duplicatesRemoved}`);

    return uniqueWords; // Return unique words
  }

  async translateWords(
    words: string[],
    targetLanguage: string,
  ): Promise<{ originalWord: string; translatedWord: string }[]> {
    this.logger.verbose('Translating words...'); // Log verbose message

    const cleanWords = this.cleanWords(words); // Clean words

    if (cleanWords.length === 0) {
      // Check if there are valid words to translate
      this.logger.warn('No valid words to translate.');
      throw new BadRequestException('No valid words to translate.');
    }

    const results = [];

    try {
      const translationPromises = cleanWords.map((word) =>
        this.httpService // Send translation request for each word
          .post(`${process.env.TRANSLATION_SERVICE_URL}/translate`, {
            q: word,
            source: 'en',
            target: targetLanguage,
            format: 'text',
          })
          .toPromise(),
      );

      const responses = await Promise.all(translationPromises); // Wait for all requests to complete
      results.push(...responses); // Add responses to results array
    } catch (error) {
      this.logger.error('Error during translation request', error.message);
      throw new BadRequestException(
        'Failed to translate words. Please try again later.',
      );
    }

    return results.map((response, index) => ({
      // Map responses to original words
      originalWord: cleanWords[index],
      translatedWord: response.data.translatedText,
    }));
  }
}
