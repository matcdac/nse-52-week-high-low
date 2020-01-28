
const fs = require('fs');

const logger = require('./logger');

/**
 * 
 * checkFileExists - Checks the existence of local file
 * 
 * @param {string} absoluteFilePath - The absolute local file path
 * 
 * @returns {Promise<boolean>}
 * resolve(true) - file is found
 * resolve(false) - file is not found
 * 
 */

function checkFileExists(absoluteFilePath) {
    return new Promise(function (resolve, reject) {
        logger.debug({
            entity: 'local file',
            action: 'check existence',
            status: 'checking',
            absoluteFilePath: absoluteFilePath,
        });
        fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                logger.error({
                    entity: 'local file',
                    action: 'check existence',
                    status: 'does not exists',
                    absoluteFilePath: absoluteFilePath,
                    error: err,
                });
                return resolve(false);
            } else {
                logger.debug({
                    entity: 'local file',
                    action: 'check existence',
                    status: 'exists',
                    absoluteFilePath: absoluteFilePath,
                });
                return resolve(true);
            }
        });
    });
}

/**
 * 
 * deleteLocalFile - Deletes the local file
 * 
 * @param {string} absoluteFilePath - The absolute local file path
 * 
 * @returns {Promise<>}
 * resolve() - file is deleted
 * reject(err) - err is encountered
 * 
 */

function deleteLocalFile(absoluteFilePath) {
    return new Promise(function (resolve, reject) {
        logger.debug({
            entity: 'local file',
            action: 'delete',
            status: 'initiated',
            absoluteFilePath: absoluteFilePath,
        });
        fs.unlink(absoluteFilePath, function (err) {
            if (err) {
                logger.error({
                    entity: 'local file',
                    action: 'delete',
                    status: 'not deleted',
                    absoluteFilePath: absoluteFilePath,
                    error: err,
                });
                return reject(err);
            } else {
                logger.debug({
                    entity: 'local file',
                    action: 'delete',
                    status: 'deleted',
                    absoluteFilePath: absoluteFilePath,
                });
                return resolve();
            }
        });
    });
}

/**
 * 
 * createLocalFileWriteStream - Creates the write stream for local file
 * 
 * @param {string} absoluteFilePath - The absolute local file path
 * 
 * @returns {Promise<WriteStream>}
 * resolve(fileWriteStream) - file stream is created
 * reject(err) - err is encountered
 * 
 */

function createLocalFileWriteStream(absoluteFilePath) {
    return new Promise(function (resolve, reject) {
        logger.debug({
            entity: 'local file',
            action: 'create write stream',
            status: 'initiated',
            absoluteFilePath: absoluteFilePath,
        });
        try {
            let fileWriteStream = fs.createWriteStream(absoluteFilePath);
            logger.debug({
                entity: 'local file',
                action: 'create write stream',
                status: 'created',
                absoluteFilePath: absoluteFilePath,
            });
            return resolve(fileWriteStream);
        } catch (err) {
            logger.error({
                entity: 'local file',
                action: 'create write stream',
                status: 'not created',
                absoluteFilePath: absoluteFilePath,
                error: err,
            });
            return reject(err);
        }
    });
}

/**
 * 
 * writeDataInStream - Write data in write stream
 * 
 * @param {string} fileWriteStream - The write stream
 * @param {string} actualData - The data to be written in write stream
 * @param {string} dataDescriptor - The data descriptor about what is going to be written in write stream
 * 
 * @returns {Promise<>}
 * resolve() - data is written in file stream
 * reject(err) - err is encountered
 * 
 */

function writeDataInStream(fileWriteStream, actualData, dataDescriptor) {
    return new Promise(function (resolve, reject) {
        logger.debug({
            entity: 'local file',
            action: 'write data',
            status: 'initiated',
            dataDescriptor: dataDescriptor,
        });
        fileWriteStream.write(actualData, function (err) {
            if (err) {
                logger.error({
                    entity: 'local file',
                    action: 'write data',
                    status: 'not written',
                    dataDescriptor: dataDescriptor,
                    error: err,
                });
                return reject(err);
            } else {
                logger.debug({
                    entity: 'local file',
                    action: 'write data',
                    status: 'written',
                    dataDescriptor: dataDescriptor,
                });
                return resolve();
            }
        });
    });
}

/**
 * 
 * closeWriteStream - Close the write stream for local file
 * 
 * @param {string} fileWriteStream - The write stream of local file
 * @param {string} absoluteFilePath - The absolute local file path
 * 
 * @returns {Promise<>}
 * resolve() - file stream is closed
 * reject(err) - err is encountered
 * 
 */

function closeWriteStream(fileWriteStream, absoluteFilePath) {
    return new Promise(function (resolve, reject) {
        logger.debug({
            entity: 'local file',
            action: 'close write stream',
            status: 'initiated',
            absoluteFilePath: absoluteFilePath,
        });
        fileWriteStream.end(function (err) {
            if (err) {
                logger.error({
                    entity: 'local file',
                    action: 'close write stream',
                    status: 'not closed',
                    absoluteFilePath: absoluteFilePath,
                    error: err,
                });
                return reject(err);
            } else {
                logger.debug({
                    entity: 'local file',
                    action: 'close write stream',
                    status: 'closed',
                    absoluteFilePath: absoluteFilePath,
                });
                return resolve();
            }
        });
    });
}

module.exports.checkFileExists = checkFileExists;
module.exports.deleteLocalFile = deleteLocalFile;
module.exports.createLocalFileWriteStream = createLocalFileWriteStream;
module.exports.writeDataInStream = writeDataInStream;
module.exports.closeWriteStream = closeWriteStream;
