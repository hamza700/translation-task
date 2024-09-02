import axios from 'axios';
import * as ExcelJS from 'exceljs';

const TRANSLATION_SERVICE_URL = 'http://localhost:3000/translate';
const WORDS_FILE_PATH = 'src/data/wordsToTranslate.xlsx';
const RESULTS_FILE_PATH = 'results/translatedWords.xlsx';
const TARGET_LANGUAGES = ['es', 'fr', 'de'];

interface TranslateRequestBody {
  words: string[];
  targetLanguage: string;
}

interface TranslateResponseBody {
  words: TranslatedWord[];
  targetLanguage: string;
}

interface TranslatedWord {
  originalWord: string;
  translatedWord: string;
}

async function readWordsFromSpreadsheet(filePath: string): Promise<string[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1)!;
  const words: string[] = [];
  worksheet.eachRow((row) => {
    // Assuming words are in the first column
    words.push(row.getCell(1).text);
  });
  return words;
}

async function translateWords(
  words: string[],
  targetLanguages: string[],
  resultsFilePath: string,
): Promise<void> {
  const translationResponses: TranslateResponseBody[] = [];

  for (const targetLanguage of targetLanguages) {
    const requestBody: TranslateRequestBody = {
      words: words,
      targetLanguage: targetLanguage,
    };

    try {
      const response = await axios.post(TRANSLATION_SERVICE_URL, requestBody);
      translationResponses.push(response.data);
    } catch (error) {
      console.error(
        `Error calling the translate endpoint ${TRANSLATION_SERVICE_URL} with target language ${targetLanguage}:`,
        error,
      );
    }
  }

  saveWordsToSpreadsheet(translationResponses, resultsFilePath);
}

async function saveWordsToSpreadsheet(
  translationResponses: TranslateResponseBody[],
  filePath: string,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  for (const translationResponse of translationResponses) {
    const worksheet = workbook.addWorksheet(
      `${translationResponse.targetLanguage} translations`,
    );

    translationResponse.words.forEach((word) => {
      worksheet.addRow([word.originalWord, word.translatedWord]);
    });
  }

  await workbook.xlsx.writeFile(filePath);
  console.log(`Translated words saved to ${filePath}`);
}

// Example usage
readWordsFromSpreadsheet(WORDS_FILE_PATH)
  .then((words) => translateWords(words, TARGET_LANGUAGES, RESULTS_FILE_PATH))
  .catch((error) => console.error(error));
