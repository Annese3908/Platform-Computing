const {By, Builder} = require('selenium-webdriver');
const assert = require("assert");
let metrics = [];
// async function to periodically track changing values
function writeToCSV(){

}
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
         
         // variables to watch time on page
         const start_time = Date.now();
         let watch_time = start_time;
         while(true){
            // track time
            const curr_time = Date.now();
            watch_time = curr_time - start_time;
            console.log( {watch_time} ,' milliseconds');
            // track scrolling
            const scroll_height = await driver.executeScript("return document.body.scrollHeight");
            curr_scroll = await driver.executeScript("return window.pageYOffset");
            console.log('Scrolled', curr_scroll, '/', scroll_height, ' pixels');
       
            await driver.sleep(2000);
        } 
    }
    catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }
 
 }())