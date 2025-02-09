import puppeteer, { Page } from "puppeteer";

export const generateOgImageService = async (url: string): Promise<string | null> => {
    console.log("xxxxxx innnn generateOgImageService");

    const browser = await puppeteer.launch({
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.NODE_ENV === "production" ?
            process.env.PUPPETEER_EXECUTABLE_PATH :
            puppeteer.executablePath(),
        headless: true,
    });

    console.log("xxxxxx outttttt generateOgImageService");


    const page = await browser.newPage();

    try {
        console.log("xxxxxx 88888 generateOgImageService");

        await page.setViewport({ width: 1200, height: 630 });

        try {
            await page.goto(url); // page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        } catch (navigationError: any) {
            console.error(`Navigation to ${url} failed: ${navigationError.message}`);
            return null;
        }

        console.log("xxxxxx 99999 generateOgImageService");

        await page.waitForFunction("true", { timeout: 60000 });

        await removeNavbar(page);

        const screenshotBase64 = await screenshotHeroSection(page);
        return screenshotBase64;
    } catch (error: any) {
        console.error(`An error occurred: ${error.message}`);
        return null;
    } finally {
        await browser.close();
    }
};

const removeNavbar = async (page: Page): Promise<void> => {
    await page.evaluate(() => {
        const headerElements = document.querySelectorAll('header, nav');
        headerElements.forEach((el) => el.remove());

        const navSelectors = [
            '.navbar', '.navigation', '.nav', '.menu', '.top-nav', '.header-nav',
            '#navbar', '#navigation', '#nav', '#menu', '#top-nav', '#header-nav',
        ];
        navSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => el.remove());
        });

        const allElements = document.querySelectorAll<HTMLElement>('*');
        allElements.forEach((el) => {
            const style = window.getComputedStyle(el);
            const isNavbar = ['sticky', 'fixed'].includes(style.position) && el.offsetHeight > 40 && el.offsetHeight < 150;
            if (isNavbar) el.remove();
        });
    });
};

const screenshotHeroSection = async (page: Page): Promise<string> => {
    const heroBounds = await page.evaluate(() => {
        const heroElement = document.querySelector('.hero');
        if (!heroElement) {
            console.warn('Hero element not found.');
            return null;
        }
        const rect = heroElement.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: 630 };
    });

    if (!heroBounds) {
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        return await page.screenshot({ encoding: 'base64', clip: { x: 0, y: 0, width: viewportWidth, height: 630 } });
    }

    return await page.screenshot({ encoding: 'base64', clip: heroBounds });
};
