import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Flight} from '../../../../core/api/models/flight';
import {FlightService} from '../../services/flight.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  searchResult$: Observable<Flight[]>
  isFindPending$: Observable<boolean>

  searchForm: FormGroup

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private fb: FormBuilder,
    private fs: FlightService
  ) {
    console.log('location: ', this.document.location.href)
    // setup form
    this.searchForm = fb.group({
      from: [],
      to: []
    })

    this.searchResult$ = this.fs.flights$
      .map(flights => flights.sort(this.orderByDate))

    this.isFindPending$ = this.fs.isFindPending$
  }

  ngOnInit() {

  }

  getUrl(): string {
    return this.document.location.href
  }

  trackByDate(index: number, item: Flight) {
    return item.id
  }

  searchFlights(form: FormGroup) {
    const data = form.value
    this.fs.find(data.from, data.to)
  }

  refreshFlights() {
    this.fs.find(null, null)
  }

  private orderByDate(a, b) {
    a = new Date(a.date).getTime();
    b = new Date(b.date).getTime();
    return a > b ? -1 : a < b ? 1 : 0;
  }

}