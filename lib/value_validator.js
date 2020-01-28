
/**
 * 
 * isValid - Validates the data, by checking existence of value in it
 * Checks if the data being passed, actually contains data, has anything in it or not
 * 
 * @param {any} data - The data to be validated
 * 
 * @returns {boolean}
 * true - data is not undefined and is present
 * false - data is not present
 * 
 * @summary for internals of the `typeof data`
 * being identified as which scenario
 * kindly check in the single lined comments
 * 
 */

function isValid(data) {
    switch (typeof data) {
        case 'undefined' : return false;
        case 'string' : var string = data;
                        string = string.replace(/[\r\n"'\\]+/g, '');
                        string = string.trim();
                        return !!string;
        case 'object' : if (!data) {
                            return false;
                        } else {
                            return true;
                        }
        case 'number' : return true;
        case 'boolean' : return true;
        case 'function' : return true;
        // Don't care conditions
        case 'error' : return true;
        default : return true;
    }
}

module.exports = isValid;
