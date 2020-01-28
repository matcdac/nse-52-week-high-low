
const os = require('os');

const logger = require('./lib/logger');

const csvHelper = require('./lib/csv_helper');

const fileHelper = require('./lib/file_helper');

const {Builder, By, Key, until} = require('selenium-webdriver');

// const divClass = 'table-responsive genlos_table clear gener_table';
// const tableClass = 'table table-hover footable footable-1 breakpoint-md';
const tableId = 'body_Middel_ctl01_grdgainer';

const headerRowClass = 'footable-header';

const comma = ',';

const localAbsoluteFilePath = '/space/projects/nse-52-week-high-low/output/data.csv';
 
(async function process() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('https://www.adroitfinancial.com/market/52week-high-low');

    const table = await driver.findElement(By.id(tableId));

    const span = await table.findElements(By.className('pageblue'));

    const currentPage = await span[0].getText();
    const totalPages = await span[1].getText();

    logger.info('fetched total number of pages', {
      currentPage: currentPage,
      totalPages: totalPages,
    });

    let tr = await table.findElement(By.className(headerRowClass));

    let thArr = await tr.findElements(By.tagName('th'));

    // Original two approaches : Clubbed

    /*

    let headerNames = [];
    let hns = [];

    let mapResult = thArr.map(async (th) => {
      const headerName = th.getText();
      const hn = await headerName;
      logger.info('inside each header', {
        hn: hn,
      });
      headerNames.push(headerName);
      hns.push(hn);
      return headerName;
    });

    let mapResultResolved = await Promise.all(mapResult);

    logger.info('processed headers', {
      mapResult: mapResult,
      mapResultResolved: mapResultResolved, // had result
      headerNames: headerNames,
      hns: hns, // had result
    });

    */

    // Approach 1

    let mapResult = thArr.map(async (th) => {
      return th.getText();
    });

    let mapResultResolved = await Promise.all(mapResult);
    const columnCount = mapResultResolved.length;

    logger.info('fetched headers', {
      columnCount: columnCount,
      headings: mapResultResolved,
    });

    let headerLine = '';
    for (let columnIndex = 0; columnIndex < columnCount-1; columnIndex += 1) {
      headerLine += csvHelper.getCsvfiedData(mapResultResolved[columnIndex]) + comma;
    }
    headerLine += csvHelper.getCsvfiedData(mapResultResolved[columnCount-1]) + os.EOL;

    logger.info('parsed header line for csv', {
      headerLine: headerLine,
    });

    const fileExists = await fileHelper.checkFileExists(localAbsoluteFilePath);
    if (fileExists) {
      await fileHelper.deleteLocalFile(localAbsoluteFilePath);
    }
    const fileWriteStream = await fileHelper.createLocalFileWriteStream(localAbsoluteFilePath);
    
    await fileHelper.writeDataInStream(fileWriteStream, headerLine, 'Header');

    
    // for first page

    let tbody = await table.findElement(By.tagName('tbody'));
    let rows = await tbody.findElements(By.tagName('tr'));

    for (let rowIndex = 0; rowIndex < rows.length-1; rowIndex += 1) {

      let row = rows[rowIndex];
      let tds = await row.findElements(By.tagName('td'));

      let rowLine = '';
      for (let columnIndex = 0; columnIndex < columnCount-1; columnIndex += 1) {

        rowLine += csvHelper.getCsvfiedData(await tds[columnIndex].getText()) + comma;
      }
      rowLine += csvHelper.getCsvfiedData(await tds[columnCount-1].getText()) + os.EOL;
  
      logger.info('parsed row line for csv', {
        rowLine: rowLine,
      });

      await fileHelper.writeDataInStream(fileWriteStream, rowLine, `Data Line ${rowIndex+1} Page ${currentPage} Total Pages ${totalPages}`);

    }



    fileHelper.closeWriteStream(fileWriteStream);

  } finally {
     await driver.quit();
  }
})();
