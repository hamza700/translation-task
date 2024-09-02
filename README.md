# Translation Service

## Introduction

This project is a simple language translation web service that accepts a list of English words and a target language for translation. It includes data validation and cleansing, ensuring that only valid and correctly spelled English words are translated. The service is implemented using NestJS and leverages a local instance of LibreTranslate for performing translations.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed (version 14.x or later).
- **Docker**: Ensure Docker is installed if you plan to run LibreTranslate using Docker.

### Setup and Run

1. **Clone the Repository**

```bash
git clone https://github.com/hamza700/translation-task.git
cd translation-service
```

2. **Install Dependencies**
   Install the required Node.js packages:

```bash
npm install
```

3. **Set Up LibreTranslate**
   You can run LibreTranslate locally using Docker. Pull the Docker image and run the container:

```bash
docker run -ti --rm -p 5001:5000 libretranslate/libretranslate
```

4. **Set Environment Variables**
   Create a .env file in the project root and add the following:

```bash
PORT=3000
TRANSLATION_SERVICE_URL=http://localhost:5001
```

5. **Run the Service**
   Start the NestJS service:

```bash
# development
npm run start:dev
```

6. **Test the Service**
   Use the provided translate-wrapper script to test the service. It reads an example set of English words, sends them to the API, and saves the translated words to results/translatedWords.xlsx.

```bash
npm run start
```

## Libraries Used and Why

- **NestJS**: A powerful, extensible Node.js framework for building scalable server-side applications. It was chosen for its modular architecture and support for TypeScript.
- **axios**: Used to make HTTP requests from the server to the LibreTranslate API.
- **is-word**: This package helps in checking whether a word is valid English. It's lightweight and easy to integrate.
- **spellchecker**: Used for identifying and correcting misspelled words.
- **dotenv**: Manages environment variables for different configurations.
- **exceljs**: Used to read from and write to Excel files, making it easy to handle input and output data.

## Translation API

- **LibreTranslate**: An open-source translation API that runs locally via Docker. It was chosen because it doesn't require an external API key and can be hosted locally, making it ideal for a quick setup in a controlled environment.

## Assumptions and Shortcuts

- **Dictionary Validity**: Assumed that the `is-word` package's dictionary is sufficiently comprehensive for detecting valid English words.
- **Spelling Corrections**: The `spellchecker` package was used for simplicity, but it has limitations, such as not supporting custom dictionaries or contextual spell-checking.
- **Rate Limiting**: The solution does not include sophisticated rate limiting or load balancing for handling large volumes of translation requests, assuming single-user or low-concurrency scenarios.

## Challenges and Solutions

- **LibreTranslate Stability**: Initially, the service was run in a virtual environment. However, it crashed when handling multiple requests simultaneously. To overcome this, I switched to using Docker to run LibreTranslate, which provided better stability and isolation.
- **Error Handling**: Ensuring robust error handling was crucial. The service logs errors clearly and returns appropriate HTTP responses to clients.

## Extra Features

- **Duplicate Removal**: The service identifies and removes duplicate words before processing, reducing unnecessary translations and API calls.
- **Detailed Logging**: Added comprehensive logging throughout the service to track the processing steps, such as the number of duplicates removed and words corrected.

## Future Improvements

- **Rate Limiting**: Implement a more sophisticated rate limiting mechanism to handle high concurrency without overwhelming the LibreTranslate service.
- **Contextual Spell-Checking**: Integrate a more advanced spell-checker that can handle contextual corrections.
- **Language Detection**: Improve the detection and handling of non-English words, possibly using an additional language detection library.
- **Scalability**: Explore deploying the service on a cloud platform with autoscaling and load balancing to handle higher traffic.

## Conclusion

This project demonstrates a basic yet functional translation service with validation and error handling. While there are areas for improvement, the current implementation serves as a solid foundation for further development.
