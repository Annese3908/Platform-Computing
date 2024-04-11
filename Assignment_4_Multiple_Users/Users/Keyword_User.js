const {By, Builder} = require('selenium-webdriver');
const assert = require('assert');

let total_reward_time = 0;

async function findKeyword(keyword, driver) {
    const page_source = await driver.executeScript('return document.documentElement.outerHTML');
    console.log(page_source.lower());
    return keyword.lower() in page_source.lower();
}
(async function trackMetrics(){
    let driver;
    try{
        // initialize driver
        driver = await new Builder().forBrowser('firefox').build();
        //navigate to website
        await driver.get('http://localhost:3000/');
         
        keywords = ['About', 'Me']
        const reward_time = 100;

            for (keyword in keywords){
                if (findKeyword(keyword, driver)){
                    driver.sleep(reward_time);
                    total_reward_time += reward_time;
                }
            }

        

    }catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }
    console.log(total_reward_time);
 }())