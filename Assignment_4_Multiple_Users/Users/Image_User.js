const {By, Builder, until} = require('selenium-webdriver');
const assert = require('assert');

let total_reward_time = 0;

async function countElem(tagName, driver) {
    const selector = By.css(`${tagName}:not([hidden])`);
    const elements = await driver.wait(until.elementsLocated(selector), 1000);
    return elements.length;
}

(async function trackMetrics(){
    let driver;
    try{
        // initialize driver
        driver = await new Builder().forBrowser('firefox').build();
        //navigate to website
        await driver.get('http://localhost:3000/');
         
        let tags = [];
        const reward_time = 10000;

        for (let tag of tags){ 
            numImages = await countElem(tag, driver); 
            //console.log(numImages);
            
            
            total_reward_time += reward_time * numImages;
            //console.log(total_reward_time);
            
            
            await driver.sleep(total_reward_time);
        }

    }finally{
        await driver.quit();
    }
    console.log(`Total reward time: ${total_reward_time} milliseconds`);
})();
