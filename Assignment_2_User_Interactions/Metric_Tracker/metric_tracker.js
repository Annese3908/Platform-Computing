const {By, Builder} = require('selenium-webdriver');
const assert = require('assert');

const mysql = require('mysql2');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Camann2003',
    database: 'metrics_db',
    port: 3306
})
con.connect(function(err){
    if(err) throw err;
    console.log('Connected!');
})

let metrics = {};
// async function to periodically track changing values

 (async function trackMetrics(){
    let driver;
    try{
        //initialize string for sql
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
         let watched = start_time;
        
         // count for while loop execution cutoff
         let count = 0;
         while(count < 3){
            let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
            // initialize metrics keys
            metrics.timestamp = metrics.timestamp || [];
            metrics.page_title = metrics.page_title || [];
            metrics.watch_time = metrics.watch_time || [];
            metrics.scrolled_pixels = metrics.scrolled_pixels || [];
            // push pre-initialized metrics
            metrics.timestamp.push(time);
            metrics.page_title.push(title);
            // track time
            const curr_time = Date.now();
            watched = (curr_time - start_time)/1000;
            console.log( {watched} ,' seconds');
            // push watch time
            metrics.watch_time.push(watched);
            // track scrolling
            const scroll_height = await driver.executeScript("return document.body.scrollHeight");
            let curr_scroll = await driver.executeScript("return window.pageYOffset");
            console.log('Scrolled', curr_scroll, '/', scroll_height, ' pixels');
            // push scrolled height
            let scrolled = curr_scroll + '/' + scroll_height;
            metrics.scrolled_pixels.push(scrolled)

            await driver.sleep(2000);
            count++;
        }
        // transform object into array of arrays based off of primary key
        let data = [];

        for (let i = 0; i < metrics.timestamp.length; i++) {
        data.push([
            metrics.timestamp[i],
            metrics.page_title[i],
            metrics.scrolled_pixels[i],
            metrics.watch_time[i],
        ]);
    }
        // insert into table
        const sql = 'INSERT INTO metrics (timestamp, page_title, scrolled_pixels, watch_time) VALUES ?'
        con.query(sql, [data], (err, result) => {
            if (err) throw err;
            console.log('Number of records inserted:', result.affectedRows);
          });     
    }

    catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }
    console.log(metrics);
    // con.end;
 }())