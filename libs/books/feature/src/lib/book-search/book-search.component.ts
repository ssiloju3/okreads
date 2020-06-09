import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError,
  removeFromReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  public books: ReadingListBook[];
  public ngUnsubscribe$: Subject<boolean> = new Subject();
  public errorMessage = '';
  public readonly getBooks$ = this.store.pipe(select(getAllBooks));
  public readonly getBooksError$ = this.store.pipe(select(getBooksError));
  searchForm = this.fb.group({
    term: ''
  });
  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackbar: MatSnackBar
  ) { }
  get searchTerm(): string {
    return this.searchForm.value.term;
  }
  ngOnInit(): void {
    this.getBooks$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(books => {
      this.books = books;
      this.errorMessage = ''
    });
    this.getBooksError$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      if (data) {
        this.errorMessage = 'Invalid Book Name'
        this.books = []
      }
    });
    this.searchForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        if (this.searchTerm === '') {
          this.errorMessage = ''
          this.books = []
        }
      });
  }
  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }
  trackByBookId(book: Book): string {
    return book.id;
  }
  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }
  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.books = []
      this.store.dispatch(clearSearch());
    }
  }
  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));

    this.snackbar
      .open(book.title + ' added.', 'undo', {
        duration: 5555,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      })
      .onAction()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        const item = { ...book, bookId: book['id'] };
        this.store.dispatch(removeFromReadingList({ item }));
      });

  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.unsubscribe();
  }
}
