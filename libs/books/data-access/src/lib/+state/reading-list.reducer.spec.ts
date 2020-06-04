import { expect } from 'chai';
import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('ReadingList Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).to.be.true;
      expect(result.ids.length).to.eq(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).to.eql(['A']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).to.eql(['A', 'B', 'C']);
    });
    it('loadReadingListError should show eror while loading reading list', () => {
      const action = ReadingListActions.loadReadingListError({
        error: 'load readingList error'
      });

      const result: State = reducer(initialState, action);
      expect(result.error).to.be.equal('load readingList error');
    });

    it('addToReadingList should add book to readingList', () => {
      const action = ReadingListActions.addToReadingList({
        book: createBook('x')
      });
      const result: State = reducer(initialState, action);
      expect(result.ids[0]).to.be.equal('x');
      expect(result.ids.length).to.eq(1);
    });

    it('loadReadingList should load the books', () => {
      const action = ReadingListActions.loadReadingList();
      const result: State = reducer(state, action);

      expect(result.loaded).to.be.false;
      expect(result.ids.length).to.eq(2);
    });

    it('removeFromReadingList should remove the book from reading List', () => {
      const action = ReadingListActions.removeFromReadingList({item:createReadingListItem('A')});

      const result: State = reducer(state, action);
      expect(result.ids.length).to.eq(1);
    });

  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).to.eql(initialState);
    });
  });
});
