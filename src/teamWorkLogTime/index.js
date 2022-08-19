require('dotenv').config()
const puppeteer = require("puppeteer");



async function handleLogin(page) {
    await page.waitForSelector('#loginemail') // wait the components
    await page.waitForSelector('#loginpassword')

    await page.type('#loginemail', process.env.TEAM_WORK_EMAIL)
    await page.type('#loginpassword', process.env.TEAM_WORK_PASSWORD)

    await page.click('[type="submit"]')
}


async function handleNavigateToList(page) {
    // select datamob project
    await page.waitForSelector('[href="#/projects/556344"]') // wait
    await page.click('[href="#/projects/556344"]') // datamob project

    // go to list
    await page.waitForSelector('[href="/#/projects/556344/tasks/list"]')
    await page.click('[href="/#/projects/556344/tasks/list"]')
}

async function handleLogTimeScript() {
    const browser = await puppeteer.launch({ headless: false }) // true for don't show process
    const page = await browser.newPage()
    await page.goto('https://3035tech.teamwork.com/launchpad/login/projects')

    await handleLogin(page)

    await handleNavigateToList(page)

    // save meetings and outsourcing


}

handleLogTimeScript()

