const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser();
const mergeOptions = require('merge-options');
const IDEA_CONFIGS_SOURCE_PATH = path.join(__dirname, './configs/.idea');
const IDEA_CONFIGS_TARGET_PATH = path.join(process.cwd(), './.idea');

mergeIdeaConfigs(IDEA_CONFIGS_SOURCE_PATH, IDEA_CONFIGS_TARGET_PATH);

/**
 * @param {string} sourceDirectoryPath
 * @param {string} targetDirectoryPath
 */
function mergeIdeaConfigs(sourceDirectoryPath, targetDirectoryPath) {
    fs.readdirSync(sourceDirectoryPath).forEach((fileDirName) => {
        const sourceFileDirPath = path.join(sourceDirectoryPath, fileDirName);
        const targetFileDirPath = path.join(targetDirectoryPath, fileDirName);
        const fileStats = fs.statSync(sourceFileDirPath);
        if (fileStats.isFile()) {
            mergeIdeaConfigFile(sourceFileDirPath, targetFileDirPath);
        } else if (fileStats.isDirectory()) {
            mergeIdeaConfigDirectory(sourceFileDirPath, targetFileDirPath);
        }
    });
}

/**
 * @param {string} sourceFilePath
 * @param {string} targetFilePath
 */
function mergeIdeaConfigFile(sourceFilePath, targetFilePath) {
    if (fs.existsSync(targetFilePath)) {
        mergeXmlFile(sourceFilePath, targetFilePath);
        return;
    }

    fs.copyFile(sourceFilePath, targetFilePath, (error) => {
        if (error) throw error;
        console.log(sourceFilePath + ' was copied to ' + targetFilePath);
    });
}

/**
 * @param {string} sourceFilePath
 * @param {string} targetFilePath
 */
function mergeXmlFile(sourceFilePath, targetFilePath) {
    const sourceFileXmlBuffer = fs.readFileSync(sourceFilePath);
    const targetFileXmlBuffer = fs.readFileSync(targetFilePath);

    Promise.all([
        xmlParser.parseStringPromise(sourceFileXmlBuffer),
        xmlParser.parseStringPromise(targetFileXmlBuffer)
    ]).then(([sourceFileJson, targetFileJson]) => {
        const mergedJson = mergeOptions.call(
            { concatArrays: true },
            targetFileJson,
            sourceFileJson
        );

        const xmldec = getXmlDeclaration(targetFileXmlBuffer);
        const headless = 0 === Object.keys(xmldec).length;
        const xmlBuilder = new xml2js.Builder({ xmldec, headless });
        fs.writeFile(
            targetFilePath,
            xmlBuilder.buildObject(mergedJson),
            (error) => {
                if (error) throw error;
                console.log(
                    'The merged xml file ' +
                        targetFilePath +
                        ' has been created!'
                );
            }
        );
    });
}

/**
 * @param {string} xmlBuffer
 * @returns {object}
 */
function getXmlDeclaration(xmlBuffer) {
    const declaration = {};
    const headerRegex = /^\<\?xml((\s+([\w\d\-\.]*)\=\"([\w\d\-\.]*)\")*)\s*\?\>/gim;
    const headerAttributeRegex = /(\s+([\w\d\-\.]*)\=\"([\w\d\-\.]*)\")/gim;

    let headerMatches = headerRegex.exec(xmlBuffer.toString());
    if (headerMatches && headerMatches.length > 1) {
        let headerAttribute;
        while (
            (headerAttribute = headerAttributeRegex.exec(headerMatches[1]))
        ) {
            if (headerAttribute && headerAttribute.length > 3) {
                declaration[headerAttribute[2]] = headerAttribute[3];
            }
        }
    }

    return declaration;
}

/**
 * @param {string} sourceDirectoryPath
 * @param {string} targetDirectoryPath
 */
function mergeIdeaConfigDirectory(sourceDirectoryPath, targetDirectoryPath) {
    if (fs.existsSync(targetDirectoryPath)) {
        mergeIdeaConfigs(sourceDirectoryPath, targetDirectoryPath);
        return;
    }

    fs.mkdir(targetDirectoryPath, (error) => {
        if (error) throw error;
        console.log(targetDirectoryPath + ' dir created!');
        mergeIdeaConfigs(sourceDirectoryPath, targetDirectoryPath);
    });
}
