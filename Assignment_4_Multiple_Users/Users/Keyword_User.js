const {By, Builder} = require('selenium-webdriver');
const assert = require('assert');

let total_reward_time = 0;

async function findKeyword(keyword, driver) {
    const page_source = await driver.getPageSource();
    return page_source.toLowerCase().includes(keyword.toLowerCase());
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

            for (const keyword of keywords){
                if (findKeyword(keyword, driver)){
                    total_reward_time += reward_time;
                    await driver.sleep(reward_time);
                }
            }

    }finally{
        await driver.quit();
    }
    console.log(`Total reward time: ${total_reward_time} milliseconds`);
 }());