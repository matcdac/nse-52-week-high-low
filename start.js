
const os = require('os');

const logger = require('./lib/logger');

const csvHelper = require('./lib/csv_helper');

const fileHelper = require('./lib/file_helper');

const {Builder, By, Key, until} = require('selenium-webdriver');

const webUri = 'https://www.adroitfinancial.com/market/52week-high-low';

const formId = 'form1';

const divId = 'defcontent';

// const divClass = 'table-responsive genlos_table clear gener_table';
// const tableClass = 'table table-hover footable footable-1 breakpoint-md';
const tableId = 'body_Middel_ctl01_grdgainer';

const headerRowClass = 'footable-header';

const nextAnchorId = 'body_Middel_ctl01_grdgainer_lnk_Next';

const comma = ',';

const localAbsoluteFilePath = '/space/projects/nse-52-week-high-low/output/data.csv';
 
async function proceed(fileWriteStream, columnCount, table, currentPage, totalPages) {

  logger.info('fetched current page', {
    currentPage: currentPage,
    totalPages: totalPages,
  });
  
  // earlier for first page, should be generic

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

    await fileHelper.writeDataInStream(fileWriteStream, rowLine, `(Line) ${rowIndex+1} (Current Page) ${currentPage} (Total Pages) ${totalPages}`);

  }
}

(async function process() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {

    const fileExists = await fileHelper.checkFileExists(localAbsoluteFilePath);
    if (fileExists) {
      await fileHelper.deleteLocalFile(localAbsoluteFilePath);
    }
    const fileWriteStream = await fileHelper.createLocalFileWriteStream(localAbsoluteFilePath);
    
    await driver.get(webUri);
    driver.manage().setTimeouts({
      pageLoad: 45000,
      implicit: 20000,
    });

    let table = await driver.findElement(By.id(tableId));

    let span = await table.findElements(By.className('pageblue'));

    let currentPage = await span[0].getText();
    let totalPages = await span[1].getText();

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

    /*
    logger.info('fetched headers', {
      columnCount: columnCount,
      headings: mapResultResolved,
    });
    */

    let headerLine = '';
    for (let columnIndex = 0; columnIndex < columnCount-1; columnIndex += 1) {
      headerLine += csvHelper.getCsvfiedData(mapResultResolved[columnIndex]) + comma;
    }
    headerLine += csvHelper.getCsvfiedData(mapResultResolved[columnCount-1]) + os.EOL;

    logger.info('parsed header line for csv', {
      headerLine: headerLine,
    });

    await fileHelper.writeDataInStream(fileWriteStream, headerLine, 'Header');

    while (currentPage <= totalPages) {
      await proceed(fileWriteStream, columnCount, table, currentPage, totalPages);
      if (currentPage != totalPages) {
        const next = await driver.findElement(By.id(nextAnchorId));
        
        await next.click();

        logger.info('click happened');

        // await next.submit();

        // await driver.switchTo().activeElement();

        // await driver.switchTo().defaultContent();

        // await driver.navigate().refresh();
        // await driver.wait(until.ableToSwitchToFrame('pageblue'));

        // (await driver.getWindowHandle()).anchor(nextAnchorId);

        // await driver.switchTo().window('default');
        
        // await driver.switchTo().frame('current');
        // logger.info('switched to frame');

        let form = await driver.findElement(By.id(formId));

        logger.info('got form');

        let div = await form.findElement(By.id(divId));

        logger.info('got div');

        table = await div.findElement(By.id(tableId));

        logger.info('got table');

        span = await table.findElements(By.className('pageblue'));

        logger.info('got spans');

        currentPage = await span[0].getText();
        totalPages = await span[1].getText();

        logger.info('next parse', {
          pageNo: currentPage,
          totalPages: currentPage,
        });
      }
    }

    await fileHelper.closeWriteStream(fileWriteStream);

  } finally {
     await driver.quit();
  }
})();
