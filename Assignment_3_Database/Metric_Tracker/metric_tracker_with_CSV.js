const {By, Builder} = require('selenium-webdriver');
const assert = require("assert");

let metrics = {};

function writeToCSV(filename, metrics){
    const fs = require('fs');
    let headers = Object.keys(metrics);
    let rows = Object.values(metrics).map(item => Object.values(item));
    let csvContent = [headers.join(','), ...rows.map(e => e.join(',')).join('\n')];

    fs.writeFile(filename, csvContent, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
       });
}
//async function to periodically track changing values
 (async function trackMetrics(){
    let driver;
    try{
        // initialize driver
        driver = await new Builder().forBrowser('firefox').build();
        //navigate to website
         await driver.get('http://localhost:3000/');
         // get title
         let title = await driver.getTitle();
         console.log({title});
         // get subhead elements
         driver.findElements(By.className("subHead")).then(function(headings){
            headings.forEach(heading => {
                heading.getText().then(heading => {
                    console.log({heading})
                })
            })
         });
         // get paragraph elements
         driver.findElements(By.css("p")).then(function(paragraphs){
            paragraphs.forEach(paragraph => {
                paragraph.getText().then(paragraph => {
                    console.log({paragraph})
                })
            })
         });
         const SAMPLE_SIZE = 3;
         let count = 0;
         metrics["Watch Time (seconds)"] = metrics["Watch Time (seconds)"] || [];
         metrics["Scroll Height (pixels)"] = metrics["Scroll Height (pixels)"] || [];

         // variables to watch time on page
         const start_time = Date.now();
         let watch_time = start_time;
         while(count < SAMPLE_SIZE){
            // track time
            const curr_time = Date.now();
            watch_time = (curr_time - start_time)/ 1000;
            console.log( {watch_time} ,' seconds');
            metrics["Watch Time (seconds)"].push(watch_time);
            // track scrolling
            const scroll_height = await driver.executeScript("return document.body.scrollHeight");
            curr_scroll = await driver.executeScript("return window.pageYOffset");
            console.log('Scrolled', curr_scroll, '/', scroll_height, ' pixels');
            //scrolled.push((curr_scroll, '/', scroll_height));
            metrics['Scroll Height (pixels)'].push((curr_scroll / curr_height));

            count++;
       
            await driver.sleep(2000);
        } 
    }
    catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }

    console.log(metrics);
    writeToCSV('metrics.csv', metrics);
 
 }())