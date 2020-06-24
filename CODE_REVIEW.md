# code smells

* Subscriptions should be unsubscribed ==> (implemented )
* Meaningful variables should be used ==> (implemented)
* Component titles were not properly described, for instance in book-search.component.spec.ts title is ProductsListComponent but it should be BookSearchComponent ==> (implemented)
* Another instance in reading-list.reducer.spec.ts title is Books Reducer but it should be ReadingList Reducer ==> (implemented)


# Accessabilty issues in OKreads app

* Making the reading list button more visible and highlighting as it might be easier for people with colour blindness to find this. => (implemented)
* Search Button do not have an accessible name => (implemented)
* Adding aria-label="search”, mat-icon aria-hidden="false" will fix accessibility. =>(implemented)
* alt text helps screen-reading tools describe images to visually impaired readers => (implemented)
* Identified low color-contrast issue in entire code base, for example p tag in book-search.component has Low-contrast text, It is difficult for many users to read. => (implemented)


# Unit tests

* Master code has Low Unit test coverage in most of the files, hence covered all the unit test coverage for the Maximum   => (implemented)
* Master code got failed with 2 unit tests cases in (web-ui-developer-puzzle/libs/books/data-access/src/lib/+state/reading-list.reducer.spec.ts) but now its fixed, Instead fixing the test case, I fixed in the reading-list.reducer.ts   . Lint and e2e tests pass. => (implemented)

# other improvements

*  Found that certain undoActions and error actions have not been completed in the corresponding reducers. Although they only fires at a point of error, suggesting to handle those  conditions properly. => (implemented)
*  Removed flickering issue while adding/removing a book in reading list. => (implemented)
* (implemented) Author master code got failed with 2 unit tests cases but now its fixed. Lint and e2e tests pass. => (implemented)
*  Once a search is done results will be rendered. if you make new search the old results will be volatile and again when we start typing the old results will get displayed. The structural directive is dependent on search Item value. Since this the bad user experience, We can tackle this either of the below implementations
    * Either we can remove old search results forever or resetting the search.
    * persist old search results and only when new results come we can display them. => (Implemented)
