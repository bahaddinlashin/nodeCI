const puppeteer = require("puppeteer")
const sessionFactory = require("./factories/sessionFactory")
let browser, page;

beforeEach(async ()=>{
    browser = await  puppeteer.launch({headless: true, args: ['--no-sandbox']});
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
});




afterEach(async ()=>{
    await browser.close();
})   

test("get text from logo",async ()=>{
    await page.waitForSelector("a.brand-logo");
    const element = await page.$("a.brand-logo")
    const value = await page.evaluate(el => el.textContent, element)
    expect(value).toEqual("Blogster")
});

// test("login page",async ()=>{
//     await page.waitForSelector(".right a");
//     await page.click(".right a")
//     const url = await page.url();
//     expect(url).toMatch(/accounts\.google\.com/)
// },50000)


test.only("login process", async () =>{
    const user_id = "686b6d00f9dbeb1fcbf8b9c7";
    
    const {session, sig} = sessionFactory(user_id);
    
    await page.setCookie({name:"session" ,value:session});
    await page.setCookie({name:"session.sig" ,value:sig});
    await page.goto("http://localhost:3000");
    await page.waitForSelector("a[href='/auth/logout']")
    const logoutSelector = await page.$("a[href='/auth/logout']");
    const textSelector = await page.evaluate(el => el.textContent,logoutSelector)

    expect(textSelector).toEqual("Logout")
})