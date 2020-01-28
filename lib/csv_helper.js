
const logger = require('./logger');

const isValid = require('./value_validator');

/**
 * regex
 * 
 * regular expression for checking
 * 
 * []+ - plus signifies all occurences of elements specified in the square brackets
 * \r - form feed
 * \n - new line
 * " - double quote
 * ' - single quote
 * \\ - backslash
 * 
 */

const regex = /[\r\n"'\\]+/g;

const lineSplitRegex = /[\n]+/g;

/**
 * 
 * getCsvfiedData - encapsules the data in quotes, to be written in csv file, in a particular row-column
 * 
 * @param {any} data - The data to be made csv compatible
 * 
 * @returns {any}
 * 
 */

function getCsvfiedData(data) {
    switch (typeof data) {
        case 'undefined' : return `""`;
        case 'string' : let string = data;
                        string = string.replace(regex, '');
                        string = string.trim();
                        return `"${string}"`;
        case 'object' : if (!data) {
                            return `""`;
                        } else {
                            // have to handle it for error
                            // if error is passed in data
                            // empty stringified object is returned
                            return JSON.stringify(data);
                        }
        case 'function' : return data;
        default : return data;
    }
}

/**
 * 
 * getCsvLines - splits the content as individual lines
 * 
 * @param {string} csvFileContent - The content of csv file
 * 
 * @returns {string[]}
 * 
 */

function getCsvLines(csvFileContent) {
    let allTextLines = [];
    if (isValid(csvFileContent)) {
        allTextLines = csvFileContent.split(lineSplitRegex);
    }
    return allTextLines;
}

function getActualDataFromCsvfiedData(data) {
    switch (typeof data) {
        case 'string' : let string = data;
                        string = string.replace(regex, '');
                        return string;
        default : return '';
    }
}

module.exports.getCsvfiedData = getCsvfiedData;
module.exports.getCsvLines = getCsvLines;
module.exports.getActualDataFromCsvfiedData = getActualDataFromCsvfiedData;
