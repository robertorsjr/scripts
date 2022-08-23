import 'dotenv/config'
import { logs } from './userInfo.js'
import puppeteer from "puppeteer";
import {handleToday} from "../utils/formatDate.js";

const {TEAM_WORK_EMAIL, TEAM_WORK_PASSWORD, URL_TO_GO} = process.env

// save meetings and outsourcing

const meetingSelector = '[href="#/tasks/23962473"]'
const outsourcingSelector = '[href="#/tasks/23973459"]'
const buttonLogTime = '[class="btn btn-secondary"]'

async function handleSelectorPageLoad (page, selector, type) {
    await page.waitForSelector(selector)
    if(type){
        return await page.type(selector, type)
    }
    return await page.click(selector)
}

async function handleLogin (page) {
    const emailInputSelector = '#loginemail'
    const passwordInputSelector = '#loginpassword'
    const submitButtonSelector = '[type="submit"]'

    await handleSelectorPageLoad(page, emailInputSelector, TEAM_WORK_EMAIL)
    await handleSelectorPageLoad(page, passwordInputSelector, TEAM_WORK_PASSWORD)

    await page.click(submitButtonSelector)
}

async function handleNavigateToLogTime (page, log) {
    const selectorToClick = log?.isMeeting ? meetingSelector : outsourcingSelector
    const listSelector = '[href="/#/projects/556344/tasks/list"]'
    const projectSelector = '[href="#/projects/556344"]'

    // // select datamob project
    await handleSelectorPageLoad(page, projectSelector)

    // go to list
    await handleSelectorPageLoad(page, listSelector)

    await handleSelectorPageLoad(page, selectorToClick)

    await handleSelectorPageLoad(page, buttonLogTime)
}

async function handleFillForm (page, log) {
    const textAreaSelector = '[class="form-control textarea-description"]'
    const buttonSubmitLogSelector = '[class="action btn btn-primary ml--auto mr--none w-loader w-loader--expand w-loader--expand-right"]'
    const dateInputSelector = '[class="w-date-input__input form-control w-input-with-icons__input"]'

    await handleSelectorPageLoad(page, dateInputSelector)
    await page.keyboard.down('ControlRight');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('ControlRight');
    await page.type(dateInputSelector, handleToday())

    await page.keyboard.press('Tab')

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

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    await handleSelectorPageLoad(page, textAreaSelector)
    await page.type(textAreaSelector, log.textArea)

    await handleSelectorPageLoad(page, buttonSubmitLogSelector)
}

( async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 20, defaultViewport: null }) // headless: true for don't show process
    const page = await browser.newPage()
    await page.goto(URL_TO_GO)

    for (let i = 0; i < logs.length; i++){
        const log = logs[i]
        await handleLogin(page)
        await handleNavigateToLogTime(page, log)
        await handleFillForm(page, log)
        await page.screenshot({ path: 'exemple.png'})
        console.log(log, 'done')
    }
    await page.browser().close()
})();




