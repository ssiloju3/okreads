import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getReadingList, removeFromReadingList, finishedReading } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit,OnDestroy {
  public readingList$ = this.store.pipe(select(getReadingList));
  public ngUnsubscribe$: Subject<boolean> = new Subject();
  public readingListItems: ReadingListItem[] = []
  constructor(private readonly store: Store) { }
  ngOnInit(): void {
    this.readingList$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.readingListItems = data;
    });
  }
  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }
  finishedReadingBook(item) {
    const finished: ReadingListItem = {...item}
    this.store.dispatch(finishedReading({item:finished}))
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.unsubscribe();
  }
}






