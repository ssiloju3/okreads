import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule, createReadingListItem  } from '@tmo/shared/testing';
import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { DebugElement } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { removeFromReadingList, getReadingList } from '@tmo/books/data-access';
import { MemoizedSelector } from '@ngrx/store';
describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let debugElement: DebugElement;
  let store:MockStore;
  let readingList$: MemoizedSelector<any, any>
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    store = TestBed.inject(MockStore);
    readingList$ = store.overrideSelector(getReadingList, [createReadingListItem('A')])
    fixture.detectChanges();
  });
  it('should create reading list component', () => {
    expect(component).toBeTruthy();
  });
  it('should dispacth an action to remove the book from reading list ', ()=> {
    spyOn(store, 'dispatch').and.callThrough();
    component.removeFromReadingList(createReadingListItem('S'));
    expect(store.dispatch)
      .toHaveBeenCalledWith(removeFromReadingList({item:createReadingListItem('S')}));
    expect(component.readingList$).toBeTruthy();
  })
});
