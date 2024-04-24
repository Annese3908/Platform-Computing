const {By, Builder} = require('selenium-webdriver');
const assert = require('assert');

let total_reward_time = 0;

async function findKeyword(keyword, driver) {
    let page_source = await driver.findElement(By.xpath('/html/body'));
    let page_text = await page_source.getText();
    return page_text.toLowerCase().includes(keyword.toLowerCase());
}
(async function trackMetrics(){
    let driver;
    try{
        // initialize driver
        driver = await new Builder().forBrowser('firefox').build();
        //navigate to website
        await driver.get('http://localhost:3000/');
         
        const keywords = ['About', 'Me']
        const reward_time = 10000;

            for (let keyword of keywords){
                if (findKeyword(keyword, driver)){
                    console.log('found ' + keyword);
                    total_reward_time += reward_time;
                    await driver.sleep(reward_time);
                }
            }

    }finally{
        await driver.quit();
    }
    console.log(`Total reward time: ${total_reward_time} milliseconds`);
 }());