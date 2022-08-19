const puppeteer = require("puppeteer");
const readlineSync = require("readline-sync");

console.log('BOOM!');

async function handleWebScript(){
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const coinBase = readlineSync.question('Coin base: ') || 'dolar'
    const coinFinal = readlineSync.question('Coin final: ') || 'real'
    const baseURL = `https://www.google.com/search?q=${coinBase}+para+${coinFinal}&rlz=1C1FCXM_pt-PTBR998BR998&oq=${coinBase}+para+${coinFinal}&aqs=chrome..69i57j0i433i512j0i512l8.4244j1j7&sourceid=chrome&ie=UTF-8`

    await page.goto(baseURL)
    await page.screenshot({ path: 'exemple.png'})

    const result = await page.evaluate(() => {
        return document.querySelector(".lWzCpb.a61j6").value
    })
    console.log(result)

    await browser.close()
}

handleWebScript()