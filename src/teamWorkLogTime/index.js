require('dotenv').config()
const puppeteer = require("puppeteer");


// save meetings and outsourcing

const meetingSelector = '[href="#/tasks/23962473"]'
const outsourcingSelector = '[href="#/tasks/23973459"]'
const buttonLogTime = '[data-identifier="task-details-log-time-button"]'

const startTimeInputSelect = '[class="w-input-with-icons__input w-time-input__input form-control time-input is-timeEntry"]'

async function handleLogin (page) {
    const emailInputSelector = '#loginemail'
    const passwordInputSelector = '#loginpassword'
    const submitButtonSelector = '[type="submit"]'

    await page.waitForSelector(emailInputSelector) // wait the components
    await page.waitForSelector(passwordInputSelector)

    await page.type(emailInputSelector, process.env.TEAM_WORK_EMAIL)
    await page.type(passwordInputSelector, process.env.TEAM_WORK_PASSWORD)

    await page.click(submitButtonSelector)
}


async function handleNavigateToLogTime (page, log) {
    // select datamob project
    await page.waitForSelector('[href="#/projects/556344"]') // wait
    await page.click('[href="#/projects/556344"]') // project

    // go to list
    await page.waitForSelector('[href="/#/projects/556344/tasks/list"]')
    await page.click('[href="/#/projects/556344/tasks/list"]')

    const selectorToClick = log?.isMeeting ? meetingSelector : outsourcingSelector
    await page.waitForSelector(selectorToClick)
    await page.click(selectorToClick)

    await page.waitForSelector(buttonLogTime)
    await page.click(buttonLogTime)
}


async function handleFillForm (page, log) {

    await page.waitForSelector(startTimeInputSelect)
    await page.click(startTimeInputSelect)

    await page.keyboard.type(log.startMeridiem)
    await page.keyboard.type(log.startHour)
    await page.keyboard.press('Tab')
    await page.keyboard.type(log.startMinutes)

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    await page.keyboard.type(log.finalMeridiem)
    await page.keyboard.type(log.finalHour)
    await page.keyboard.press('Tab')
    await page.keyboard.type(log.finalMinutes)


    const textAreaSelector = '[class="form-control textarea-description"]'
    await page.waitForSelector(textAreaSelector)
    await page.type(textAreaSelector, log.textArea)

    const buttonSubmitLogSelector = '[class="action btn btn-primary ml--auto mr--none w-loader w-loader--expand w-loader--expand-right"]'
    await page.waitForSelector(buttonSubmitLogSelector)
    await page.click(buttonSubmitLogSelector)
}


async function handleLogTimeScript(log) {
    const browser = await puppeteer.launch({ headless: false }) // true for don't show process
    const page = await browser.newPage()
    await page.goto(process.env.URL_TO_GO)

    await handleLogin(page)

    await handleNavigateToLogTime(page, log)

    await handleFillForm(page, log)

    await page.screenshot({ path: 'exemple.png'})

    console.log(log, 'done')

    await page.browser().close()
}

async function scriptRun () {
    const meeting = {
        isMeeting: true,
        startMeridiem: 'a',
        startHour: '10',
        startMinutes: '15',
        finalMeridiem: 'p',
        finalHour: '12',
        finalMinutes: '00',
        textArea: 'daily datamob/3035tech'
    }
    const morningOutsourcing = {
        startMeridiem: 'a',
        startHour: '9',
        startMinutes: '00',
        finalMeridiem: 'a',
        finalHour: '10',
        finalMinutes: '15',
        textArea: 'code review'
    }
    const afterNoonOutsourcing = {
        startMeridiem: 'p',
        startHour: '1',
        startMinutes: '00',
        finalMeridiem: 'p',
        finalHour: '6',
        finalMinutes: '00',
        textArea: 'Resolvendo bugs nas tasks: 1611 e 1578'
    }

    await handleLogTimeScript(meeting)
    await handleLogTimeScript(morningOutsourcing)
    await handleLogTimeScript(afterNoonOutsourcing)
}

scriptRun()



