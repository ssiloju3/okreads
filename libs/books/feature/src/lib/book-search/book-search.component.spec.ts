import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { addToReadingList, getAllBooks, clearSearch, getBooksError } from '@tmo/books/data-access';
import { MemoizedSelector } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;
  let getBooks: MemoizedSelector<any, any>
  let getBooksLoadError: MemoizedSelector<any,any>
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore()]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    getBooks = store.overrideSelector(
      getAllBooks,
      [createBook('A'), createBook('B')]
    );
    getBooksLoadError = store.overrideSelector(getBooksError, { error: "Invalid book name"  });
    fixture.detectChanges();
  });
  it('should create the book search component', () => {
    const term = component.searchForm.controls['term'];
    term.setValue("javascript");
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call formatDate to return the valid date', () => {
    const date = new Date().toISOString()
    const returnValue = component.formatDate(date);
    const expectedDateValue = new Intl.DateTimeFormat('en-US').format(new Date(date))
    expect(returnValue).toEqual(expectedDateValue);
    const expectUndefined = component.formatDate(undefined);
    expect(expectUndefined).toBeUndefined;
  })
  it('should call trackByBookId with valid book', () => {
    expect(component.trackByBookId(createBook('A'))).toEqual('A');
  })
  it('should dispatch an action to add a book to readingList', () => {
    spyOn(store, 'dispatch').and.callFake(() =>{});
    component.addBookToReadingList(component.books[0])
    fixture.detectChanges();
    expect(store.dispatch)
      .toHaveBeenCalledWith(addToReadingList({ book: component.books[0] }));
  });
  it('should search a book for valid search term', () => {
    component.searchExample();
    expect(component.searchForm.value).toEqual({ term: 'javascript' });
  });
  it('should dispatch an action to clear the search', () => {
    spyOn(store, 'dispatch').and.callFake(() =>{});
    const term = component.searchForm.controls['term'];
    term.setValue("");
    getBooksLoadError.setResult(null)
    store.refreshState();
    fixture.detectChanges();
    component.searchBooks();
    expect(store.dispatch)
      .toHaveBeenCalledWith(clearSearch());
  });
  it('should call searchBooks with no search term', () => {
    getBooksError.setResult("");
    store.refreshState();
    const term = component.searchForm.controls['term'];
    term.setValue("");
    fixture.detectChanges();
    component.searchBooks();
    expect(component.searchTerm).toBe('');
  });
  it('Should display the results when user type in input search field', fakeAsync(() => {
    component.searchForm.setValue({ term: 'javascript' });
    getBooks = store.overrideSelector(getAllBooks, [createBook('javascript')]);
    store.refreshState();
    tick(500);
    expect(component.books).toBeDefined();
 }));
});
