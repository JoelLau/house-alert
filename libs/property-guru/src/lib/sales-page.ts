import { chromium } from 'playwright';
import { HouseEntry, Price } from './house-entry.type';

export const SKYVILLE_AT_DAWSON = 'skyville@dawson';

export class PropertyForSalePage {
  async fetchHouses(freetext: string) {
    // setup
    const browser = await chromium.launch();
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    });
    const page = await context.newPage();

    const url = new URL('property-for-sale', 'https://www.propertyguru.com.sg');
    url.searchParams.set('market', 'residential');
    url.searchParams.set('listing_type', 'sale');
    url.searchParams.set('freetext', freetext);

    const PG_SKY_URL = url.toString();

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
        return Array.from(listingCards).reduce<HouseEntry[]>((prev, curr) => {
          const link = curr
            .querySelector('[data-automation-id="listing-card-title-txt"]')
            .getAttribute('href');

          const address = curr.querySelector('.listing-location').textContent;

          const priceAmount = curr.querySelector(
            '[data-automation-id="listing-card-price-txt"] .price'
          ).textContent;

          const price: Price = {
            currency: 'SGD',
            amount: parseInt(priceAmount.replace(',', '')),
            precision: 1,
          };

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
}

export class ListingsCard {
  card: HTMLElement;

  constructor(card: HTMLElement) {
    this.card = card;
  }

  getListingsUrl(): string {
    return this.card
      .querySelector('[data-automation-id="listing-card-title-txt"]')
      .getAttribute('href');
  }
}
