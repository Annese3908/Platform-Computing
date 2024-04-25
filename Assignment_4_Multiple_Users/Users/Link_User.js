const {By, Builder, until} = require('selenium-webdriver');
const assert = require('assert');

let total_reward_time = 0;

async function countElem(tagName, driver) {
    const selector = By.css(`${tagName}:not([hidden])`);
    const elements = await driver.wait(until.elementsLocated(selector), 1000);
    return elements.length;
}
async function findKeyword(keyword, driver) {
    let page_source = await driver.getPageSource();
    return page_source.toLowerCase().includes(keyword.toLowerCase());
}
async function findLink(link, driver) {
    try {
        let links = await driver.findElement(By.css(link));
        await links.click();
        // Return true to indicate the link was found and clicked
        return true;
    } catch (error) {
        return false;
    }
}

async function userAction(action, driver, reward_time, req_list){
    total_reward_time = 0;
    if (action.toUpperCase() == 'KEYWORD'){
        for (let keyword of req_list){
            if (findKeyword(keyword, driver)){
                console.log('found ' + keyword);
                total_reward_time += reward_time;
                await driver.sleep(reward_time);
            }
            else{
                console.log(keyword + ' not found.');
            }
        }
    }
    else if (action.toUpperCase() == 'IMAGE'){
        for (let tag of req_list){ 
            numImages = await countElem(tag, driver); 
            console.log(numImages + ' images found.');
            total_reward_time += reward_time * numImages;
            await driver.sleep(total_reward_time);
        }
    }

    else if (action.toUpperCase() == 'LINK'){
        for (let link of req_list){
            let count = 0;
            while(await findLink(link, driver)){
                total_reward_time += reward_time;
                await driver.sleep(total_reward_time);
                count++;
            }
        }
    }
    return total_reward_time;
}
(async function trackMetrics(){
    let driver;
    try{
        // initialize driver
        driver = await new Builder().forBrowser('firefox').build();
        //navigate to website
        await driver.get('http://localhost:3000/');
         
        const reward_time = 10000;
        keywords = ['About', 'Me'];
        total_reward_time += await userAction('Keyword', driver, reward_time, keywords);
        tags = ['img'];
        total_reward_time += await userAction('IMAGE', driver, reward_time, tags);
        links = ['a'];
        total_reward_time += await userAction('LINK', driver, reward_time, links)


          
            

        

    }catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }
    console.log(`Total reward time: ${total_reward_time} milliseconds`);
 }())