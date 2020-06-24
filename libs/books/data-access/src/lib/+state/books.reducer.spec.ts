import { initialState, reducer, State, booksAdapter } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;
    beforeAll(() => {
      state = booksAdapter.setAll(
        [createBook('A'), createBook('B'), createBook('C')],
        initialState
      );
    });

    it('loadBooksSuccess should return set the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });
    it('searchBooks should return list of all books', () => {
      const action = BooksActions.searchBooks({ term: 'Book' });

      const result: State = reducer(state, action);

      expect(result.ids.length).toBe(3);
      expect(result.loaded).toBe(false);
      expect(result.searchTerm).toBe('Book');
    });

    it('searchBooksFailure should return the error message', () => {
      const error = { statusCode: 422, message: 'Missing serach term' };
      const action = BooksActions.searchBooksFailure({ error });

      const result: State = reducer(state, action);
      expect(result.error).toBe(error);
    });

    it('clearSearch should remove all books in the store', () => {
      const action = BooksActions.clearSearch();
      const result = reducer(state, action);
      expect(result.ids.length).toBe(0);
    });

  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
