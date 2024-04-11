const {By, Builder} = require('selenium-webdriver');
const assert = require('assert');

let total_reward_time = 0;

async function countElem(tagName, driver) {
    return driver.findElement(By.css(tagName)).length;
}
(async function trackMetrics(){
    let driver;
    try{
        // initialize driver
        driver = await new Builder().forBrowser('firefox').build();
        //navigate to website
        await driver.get('http://localhost:3000/');
         
        links = ['a']
        const reward_time = 100;

            for (link in links){
               numImages =  countElem(link, driver)
                    driver.sleep(reward_time);
                    total_reward_time += reward_time * numImages;
            }
            

        

    }catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }
    console.log(total_reward_time);
 }())