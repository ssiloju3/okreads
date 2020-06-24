import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getReadingList, removeFromReadingList, addToReadingList } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '@tmo/shared/models';
@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit,OnDestroy {
  public readingList$ = this.store.pipe(select(getReadingList));
  public ngUnsubscribe$: Subject<boolean> = new Subject();
  public readingListItems: ReadingListItem[] = []
  constructor(private readonly store: Store, private snackbar: MatSnackBar) { }
  ngOnInit(): void {
    this.readingList$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.readingListItems = data;
    });
  }
  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));

    this.snackbar
      .open(item.title + ' removed.', 'undo', {
        duration: 5555,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      })
      .onAction()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        const book: Book = item;
        this.store.dispatch(addToReadingList({ book }));
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.unsubscribe();
  }
}








