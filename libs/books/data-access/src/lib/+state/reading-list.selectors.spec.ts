import { initialState, readingListAdapter } from './reading-list.reducer';
import {
  booksAdapter,
  initialState as booksInitialState
} from './books.reducer';
import * as ToReadSelectors from './reading-list.selectors';
import { createBook, createReadingListItem } from '@tmo/shared/testing';
import { read } from 'fs';

describe('ReadingList Selectors', () => {
  let state;
  beforeEach(() => {
    const readItem = createReadingListItem('D')
    readItem.finished = true
    const book = createBook('E')
    book['finished'] = false
    state = {
      books: booksAdapter.addMany(
        [createBook('A'), createBook('B'), createBook('C'),createBook('D'),book],
        {
          ...booksInitialState,
          error: 'Unknown error',
          loaded: true
        }
      ),
      readingList: readingListAdapter.addMany(
        [
          createReadingListItem('A'),
          createReadingListItem('B'),
          createReadingListItem('C'),
          readItem
        ],
        {
          ...initialState,
          error: 'Unknown error',
          loaded: true
        }
      )
    };
  });

  describe('Books Selectors', () => {
    it('getReadingList() should return the list of Books', () => {
      const results = ToReadSelectors.getReadingList(state);
      expect(results.length).toBe(4);
      expect(results.map(x => x.bookId)).toEqual(['A', 'B', 'C','D']);
    });
    it("getTotalUnread() should return the current 'loaded' status", () => {
      const result = ToReadSelectors.getTotalUnread(state);
      expect(result).toBe(4);
    });
    it('getAllBooks should returns all books', ()=> {
      const result = ToReadSelectors.getAllBooks(state);
      expect(result.length).toBe(5);
    });
  });
});
