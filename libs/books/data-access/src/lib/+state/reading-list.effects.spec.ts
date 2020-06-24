import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';
import {
  SharedTestingModule,
  createBook,
  createReadingListItem
} from '@tmo/shared/testing';


import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), SharedTestingModule],
      providers: [
        ReadingListEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {

    it('should test OnInitEffect to load readlingList', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListEffects.prototype.ngrxOnInitEffects());
      effects.loadReadingList$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should load readingList successfully', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.loadReadingList());

      effects.loadReadingList$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
    it('should mock an http error while loading ReadingList', done=> {

      actions = new ReplaySubject();
      actions.next(ReadingListActions.loadReadingList());

      effects.loadReadingList$.subscribe(action => {
        expect({error:action.type, type:'[Reading List] Load list error'}).to.eql(
          ReadingListActions.loadReadingListError({error:'[Reading List] Load list error'})
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush(null,{status:400, statusText: 'Bad Request'});

    });
  });
  describe('addBook$', () => {

    it('should add a book to reading list', done => {
      actions = new ReplaySubject();
      const book = createBook('book');
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
        done();
      });
      httpMock.expectOne('/api/reading-list').flush(book);
    });

    it('should mock undoAction for add to reading list upon http failure', done => {
      actions = new ReplaySubject();
      const book = createBook('book');
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedAddToReadingList({ book })
        );

        done();
      });
      httpMock
        .expectOne('/api/reading-list')
        .flush(null, { status: 400, statusText: 'bad request' });
    });
  });
  
  describe('removeBook$', () => {
  it('should remove the book from readingList', done => {
    actions = new ReplaySubject();

    const item = createReadingListItem('A');
    actions.next(ReadingListActions.removeFromReadingList({ item }));

    effects.removeBook$.subscribe(action => {
      expect(action).to.eql(
        ReadingListActions.confirmedRemoveFromReadingList({ item })
      );
      done();
    });
    httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush(item);

  });
  it('should mock undoAction for the removed book upon remove failure', done => {
    actions = new ReplaySubject();

    const item = createReadingListItem('A');
    actions.next(ReadingListActions.removeFromReadingList({ item }));

    effects.removeBook$.subscribe(action => {
      expect(action).to.eql(
        ReadingListActions.failedRemoveFromReadingList({ item })
      );
      done();
    });
    httpMock
      .expectOne(`/api/reading-list/${item.bookId}`)
      .flush(null, { status: 400, statusText: 'bad request' });
  });
});

});
