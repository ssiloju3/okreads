import { $, browser, ExpectedConditions, $$ } from 'protractor';

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

  it('Then: Upon click finished button in a readingList book.', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const input = await $('input[type="search"]');
    await input.sendKeys('j');
    const form = await $('form');
    await form.submit();

    let addToReadingListButtonitems = await $$(
      '[data-testing="Add-To-Reading"]' 
    );
    const enabledBtns  = await $$(
      '[data-testing="book-item"] button:not(:disabled)' 
    );
    if(await enabledBtns.length > 0) {
      
      const firstbookTitle = await $$('[data-testing="book--title"]');

      const readingListToggle = await $('[data-testing="toggle-reading-list"]');
  
      const text = await firstbookTitle[0].getText();
  
      await enabledBtns[0].click();
  
      await readingListToggle.click();
      browser.sleep(1000);
      const readingListItemDetailsTitle = await $$(
        '[data-testing="reading-list-item--details--title"]'
      );
      const markAsFinishedButton = await $$(
        '[data-testing="mark-as-finished-button"]'
      );
  
      await browser.wait(
        ExpectedConditions.textToBePresentInElement(
          readingListItemDetailsTitle[0],
          text
        )
      );
  
      await markAsFinishedButton[0].click();
  
      addToReadingListButtonitems = await $$('[data-testing="Add-To-Reading"]');
  
      await browser.wait(
        ExpectedConditions.textToBePresentInElement(
          addToReadingListButtonitems[0],
          'Finished'
        )
      );
    }
    
  });

  

});