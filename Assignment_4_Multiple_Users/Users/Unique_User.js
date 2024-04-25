//Annese's Unique User
const {By, Builder, until} = require('selenium-webdriver');
const assert = require('assert');
let total_reward_time = 0;

async function countElem(id, driver) {
    const selector = By.id(id);
    const elements = await driver.wait(until.elementsLocated(selector), 1000);
    return elements.length;
}

async function findLink(href, driver) {
    try {
        let link = await driver.findElement(By.css(`a[href="${href}"]`));
        await link.click();
        return true;
      } catch (error) {
        return false;
      }
    
}
async function userAction(action, driver, reward_time, req_list){
    total_reward_time = 0;
    if (action.toUpperCase() == 'KEYWORD'){
        let page_source = await driver.getPageSource();
        let keywordCounts = {}
        keywords.forEach(keyword => {
            keywordCounts[keyword] = 0;
        });
        req_list.forEach(async keyword =>{
            keywordCounts[keyword] = (page_source.match(new RegExp(keyword, 'g')) || []).length;
            console.log(`Found ${keyword}: ${keywordCounts[keyword]} times`);
            total_reward_time += reward_time * keywordCounts[keyword];
            await driver.sleep(reward_time * keywordCounts[keyword]);
        })

    }
    else if (action.toUpperCase() == 'IMAGE'){
        numImages = 0;
        for (let id of req_list){ 
            numImages += await countElem(id, driver); 
            total_reward_time += reward_time * numImages;
            await driver.sleep(total_reward_time);
        }
        console.log(numImages + ' images found.');
    }

    else if (action.toUpperCase() == 'LINK'){
        for (let href of req_list){
            while(await findLink(href, driver)){
                console.log(`${href} found.`);
                total_reward_time += reward_time;
                await driver.sleep(total_reward_time);
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
        keywords = ["I'm", 'Annese', 'me', 'my'];
        total_reward_time += await userAction('Keyword', driver, reward_time, keywords);
        ids = ['HyruleWarriors', 'Persona'];
        total_reward_time += await userAction('IMAGE', driver, reward_time, ids);
        hrefs = ['https://github.com/Annese3908/Platform-Computing'];
        total_reward_time += await userAction('LINK', driver, reward_time, hrefs);
    }catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }
    console.log(`Total reward time: ${total_reward_time} milliseconds`);
 }())
