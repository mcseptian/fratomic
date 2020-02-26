const fs = require('fs');
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const cheerio = require('cheerio');

const numberOfChromeInstances = 1;
const port = process.env.PORT || 3000;
const distDir = path.join(__dirname, '../build');
const previewDir = `${distDir}/components/preview`;
const reportDir = `${distDir}/components/report`;
const detailDir = `${distDir}/components/detail`;

process.setMaxListeners(Infinity);

const start = Date.now();

// Boot Express server
const app = express();
app.set('port', port);
app.use('/', express.static(distDir));

const server = app.listen(port, () => {
  console.info('\u001b[33m' + 'Server started');
  const previewFiles = getPreviewURLs();
  launchChrome(previewFiles);
});

function getPreviewURLs() {
  return fs.readdirSync(previewDir);
}

function makeReportsDir() {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir);
  }
}

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function launchChrome(previewFiles) {

  const numberOfPreviews = previewFiles.length;

  const chromeInstances = [];

  const audits = new Promise(resolve => {
      (async () => {
        // Start chrome instances
        console.log('\u001b[36m' + `Launch ${numberOfChromeInstances} Chrome instances`)
        for (let i = 0; i < numberOfChromeInstances; i++) {
          await puppeteer
            .launch({
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
            .then(chrome => chromeInstances.push({
              available: true,
              chrome,
              port: (new URL(chrome.wsEndpoint())).port
            }))
            .catch(err => {
              console.error(err)
            });
        }

        let index = 0;

        let numberAudited = 0;

        // Start reporting accessibility of each component preview
        async function next() {
          if (index < numberOfPreviews) {
            const chromeInstance = chromeInstances.find(instance => instance.available);

            const flags = {
              port: chromeInstance.port,
              onlyCategories: ['accessibility']
            };

            const file = previewFiles[index];

            const result = lighthouse(`http://localhost:${port}/components/preview/${file}`, flags)
            .then(async (result) => {
              console.log('\u001b[34m' + `Auditing ${file} (${index} of ${numberOfPreviews})`);
                // Provide headless chrome availability to another test
                chromeInstance.available = true;

                // Generate A11y report
                const html = ReportGenerator.generateReport(result.lhr, 'html').replace('.lh-header-sticky {', '.lh-header-sticky {\n  display: none;');

                // Write A11y report to the report file
                fs.writeFileSync(`${reportDir}/${file}`, html, error => console.error(error));

                // Read detail template
                await readFileAsync(`${detailDir}/${file}`)
                  .then(data => {
                    // Load detailed report file
                    const $ = cheerio.load(data);

                    // Add an accessibility tab if one doesn't exist
                    const id = $('.Browser-tab--html a').attr('href').replace('panel-html', '').replace('#', '');

                    if ($('.Browser-tab--a11y').length === 0) {
                      $('.Browser-tabs').append(`<li class="Browser-tab Browser-tab--a11y" data-role="tab"><a href="#${id}-panel-a11y"></a></li>`);

                      $('.Browser').append(`<div class="Browser-panel Browser-a11y" id="${id}-panel-a11y" data-role="tab-panel"><iframe class="Preview-iframe" data-role="window" src="../report/${file}" sandbox="allow-same-origin allow-scripts allow-forms" marginwidth="0" marginheight="0" frameborder="0" vspace="0" hspace="0" scrolling="yes"></iframe></div>`);
                    }

                    // Put accessibility score in tab heading
                    $('.Browser-tab--a11y a').html(`Accessibility (${result.lhr.categories.accessibility.score * 100}%)`);

                    // Modify detailed report file
                    fs.writeFileSync(`${detailDir}/${file}`, $.html(), error => console.error(error));

                    console.info('\u001b[32m' + `Write ${detailDir}/${file} successfully.`)
                  })
                  .catch(err => {
                    console.error(err)
                  });
                numberAudited++;
                next();
              })
              .catch(err => {
                index--;
                chromeInstance.available = false;
                console.error(`Accessibility test failed with the following message: ${err}`);
              });

            index++;

            return result;

          } else if (numberAudited === numberOfPreviews) {
            resolve();
          }
        }

        makeReportsDir();

        while (index < numberOfChromeInstances && index < numberOfPreviews) {
          next();
        }
      })();
    })
    .then(async () => {
      server.close();
      console.info('\u001b[33m' + 'Finished auditing');
      console.log('\u001b[36m' + 'Shutting down chrome instances');
      let index = 0;
      const shutDownPromises = [];

      while (index < numberOfChromeInstances) {
        shutDownPromises.push(chromeInstances[index].chrome.close());
        index++;
      }

      Promise.all(shutDownPromises)
        .then(() => {
          const elapsedSeconds = (Date.now() - start) / 1000;
          const elapsedMins = Math.floor(elapsedSeconds / 60);
          const remainderSeconds = Math.round(elapsedSeconds - (elapsedMins * 60));
          console.info(`Lighthouse audits took ${elapsedMins}min ${remainderSeconds}secs`);
          process.exit();
        })
        .catch(err => {
          console.error(err)
        });
    })
    .catch(err => {
      console.error(err)
    });
}
