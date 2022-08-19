require('dotenv').config()
const puppeteer = require("puppeteer");


// save meetings and outsourcing

const meetingSelector = '[href="#/tasks/23962473"]'
const outsourcingSelector = '[href="#/tasks/23973459"]'
const buttonLogTime = '[data-identifier="task-details-log-time-button"]'

const startTimeInputSelect = '[class="w-input-with-icons__input w-time-input__input form-control time-input is-timeEntry"]'
const endTimeInputSelector = '[class="w-input-with-icons__input w-time-input__input form-control time-input is-timeEntry hasChanged"]'

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

    await page.waitForSelector(meetingSelector)
    await page.click(meetingSelector)

    await page.waitForSelector(buttonLogTime)
    await page.click(buttonLogTime)

    await page.waitForSelector(startTimeInputSelect)
    await page.click(startTimeInputSelect)
}

handleLogTimeScript()

