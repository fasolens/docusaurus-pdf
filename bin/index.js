#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const { generatePdf, generatePdfFromBuildSources } = require('../lib');

program
  .version(require('../package.json').version)
  .name('docusaurus-pdf')
  .usage('<initialDocsUrl> [filename]')
  .description('Generate PDF from initial docs url')
  .arguments('<initialDocsUrl> [filename]')
  .action((initialDocsUrl, filename) => {
    generatePdf(initialDocsUrl, filename)
      .then((res) => {
        console.log(chalk.green('Finish generating PDF!'));
        process.exit(0);
      })
      .catch(err => {
        console.error(chalk.red(err.stack));
        process.exit(1)
      });
  });

program
  .command('from-build <dirPath> <firstDocPagePath> [baseUrl]')
  .description('Generate PDF from a docusaurus build artifact')
  .option('-o, --output-file [name]', 'Specify your file name. Default is docusaurus.pdf')
  .option('--no-sandbox', 'Start puppeteer with --no-sandbox flag')
  .action((dirPath, firstDocPagePath, baseUrl, options) => {
    const puppeteerArgs = options.sandbox ? [] : ['--no-sandbox'];
    generatePdfFromBuildSources(dirPath, firstDocPagePath, baseUrl, options.outputFile, puppeteerArgs)
      .then((res) => {
        console.log(chalk.green('Finish generating PDF!'));
        process.exit(0);
      })
      .catch(err => {
        console.error(chalk.red(err.stack));
        process.exit(1)
      });
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
