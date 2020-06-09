import { $, browser, ExpectedConditions, $$, by } from 'protractor';
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
  it('by clicking undo in reading list show the removed book in the reading list again', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const input = await $('input[type="search"]');
    await input.sendKeys('j');
    const form = await $('form');
    await form.submit();
    const addToReadingListButtonitems = await $$('.reading-list .reading-list-item');
    const wantToReadBtns  = await $$(
      '[data-testing="book-item"] button:not(:disabled)'
    );
    if(await wantToReadBtns.length > 0) {
      const readingListToggle = await $('[data-testing="toggle-reading-list"]');
      await wantToReadBtns[0].click();
      await readingListToggle.click();
      const removeFromReadingListButtonitems = await $$('[data-testing="Remove-From-Reading"]');
      await removeFromReadingListButtonitems[(removeFromReadingListButtonitems.length)-1].click();
      const undoBtn = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
      undoBtn.click();
      const afterUndoToReadingList = await $$('.reading-list .reading-list-item');
      expect(afterUndoToReadingList.length).to.equal(addToReadingListButtonitems.length)
    }
  });
  it('Should be able to add book to reading list and undo from reading list.', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const input = await $('input[type="search"]');
    await input.sendKeys('Java');
    const form = await $('form');
    await form.submit();
    const addToReadingListButtonitems = await $$('.reading-list .reading-list-item');
    const wantToReadBtns  = await $$(
      '[data-testing="book-item"] button:not(:disabled)'
    );
    if(await wantToReadBtns.length > 0) {
      await wantToReadBtns[0].click();
      const undoBtn = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
      undoBtn.click();
      const afterAddingToReadingList = await $$('.reading-list .reading-list-item');
      expect(afterAddingToReadingList.length).to.equal(addToReadingListButtonitems.length)
    }
  });  
});
