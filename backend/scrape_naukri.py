import sys
import asyncio
from playwright.async_api import async_playwright
import json
import logging

# Redirect log output to stderr
logging.basicConfig(stream=sys.stderr, level=logging.INFO)

async def scrape_naukri(keywords, location):
    url = f"https://www.naukri.com/{keywords.replace(' ', '-')}-jobs-in-{location.replace(' ', '-')}"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        await page.goto(url, wait_until='networkidle')
        await page.wait_for_timeout(10000)
        for _ in range(10):
            await page.mouse.wheel(0, 2000)
            await page.wait_for_timeout(1000)
        try:
            await page.click('button[aria-label="Close"]', timeout=3000)
        except:
            pass

        jobs = await page.query_selector_all('div.cust-job-tuple')
        logging.info(f"Found {len(jobs)} jobs")
        results = []
        for job in jobs[:20]:
            title_el = await job.query_selector('a.title')
            title = await title_el.inner_text() if title_el else ''
            link = await title_el.get_attribute('href') if title_el else ''
            company_el = await job.query_selector('a.comp-name')
            company = await company_el.inner_text() if company_el else ''
            location_el = await job.query_selector('span.locWdth')
            location = await location_el.inner_text() if location_el else ''
            desc_el = await job.query_selector('span.job-desc')
            description = await desc_el.inner_text() if desc_el else ''
            results.append({
                'title': title.strip(),
                'company': company.strip(),
                'location': location.strip(),
                'link': link,
                'description': description.strip()
            })
        await browser.close()
        print(json.dumps(results, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    keywords = sys.argv[1] if len(sys.argv) > 1 else 'data-analyst'
    location = sys.argv[2] if len(sys.argv) > 2 else 'india'
    asyncio.run(scrape_naukri(keywords, location))