import { $, browser, ExpectedConditions, $$, element, by } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: should find read book from reading list and mark as finished', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    const readListItemsCount = await element.all(by.css('.reading-list-item')).count();
    await readingListToggle.click();
    if (readListItemsCount > 0) {
      const markAsFinishBtnCount = await element.all(by.css(".finishbutton")).count();
      if (markAsFinishBtnCount > 0) {
        const finishBtn = await element.all(by.css(".finishbutton")).first();
        await finishBtn.click();
        const afterFinishCount = await element.all(by.css(".finishbutton")).count();
        expect(afterFinishCount).to.eql((markAsFinishBtnCount - 1));
      }
    }
  })
});