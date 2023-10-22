import { chromium } from 'playwright';

function getUrl(): string {
  const url = new URL('property-for-sale', 'https://www.propertyguru.com.sg');
  url.searchParams.set('market', 'residential');
  url.searchParams.set('listing_type', 'sale');
  url.searchParams.set('freetext', 'skyville@dawson');

  return url.toString();
}

const PG_SKY_URL = getUrl();

async function main() {
  // setup
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' +
      ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  });
  const page = await context.newPage();

  // navigation
  console.log(`navigating to: ${PG_SKY_URL}`);
  await page.goto(PG_SKY_URL);
  console.log(`navigating to: ${PG_SKY_URL} DONE`);

  // scraping
  console.log(`beginning scrape`);

  console.log('waiting for #listings-container to load');
  const listingsContainer = await page.$('#listings-container');
  console.log('waiting for #listings-container to load DONE');

  const results = await listingsContainer.$$eval(
    '.listing-card',
    (listingCards) => {
      return Array.from(listingCards).reduce((prev, curr) => {
        console.log('qwer');
        const link = curr
          .querySelector('[data-automation-id="listing-card-title-txt"]')
          .getAttribute('href');

        const address = curr.querySelector('.listing-location').textContent;

        const price = curr.querySelector(
          '[data-automation-id="listing-card-price-txt"] .price'
        ).textContent;

        prev.push({ link, address, price });
        return prev;
      }, []);
    }
  );
  console.log(`beginning scrape DONE`);

  await browser.close();

  console.log(`results: ${JSON.stringify(results)}`);
  return results;
}

main();
