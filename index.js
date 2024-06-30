const fs = require('fs').promises;
const path = require('path');

// Function to count words in a file
async function countWords(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        // Split the data into words and filter out empty strings
        const words = data.split(/\s+/).filter(word => word.length > 0);
        return words.length;
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err.message);
        return null;
    }
}

// Function to process the list of files
async function processFiles(fileList) {
    const wordCounts = await Promise.all(fileList.map(async (filePath) => {
        const wordCount = await countWords(filePath);
        return { filePath, wordCount };
    }));

    wordCounts.forEach(({ filePath, wordCount }) => {
        if (wordCount !== null) {
            console.log(`File: ${filePath}, Word Count: ${wordCount}`);
        }
    });
}

// Main function to read the config file and start processing
async function main() {
    const configFilePath = path.join(__dirname, 'config.json');

    try {

        const configData = await fs.readFile(configFilePath, 'utf-8');
        const config = JSON.parse(configData);

        if (Array.isArray(config.files)) {
            await processFiles(config.files);
        } else {
            console.error('Configuration file is not in the expected format (array of file paths).');
        }
    } catch (err) {
        console.error('Error reading configuration file:', err.message);
    }
}

main().catch(err => console.error('Unhandled error:', err.message));
