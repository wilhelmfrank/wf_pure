import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, filter, map, startWith, tap } from 'rxjs';
import { ItemVersionVO } from 'src/app/pure/model/inge';
import { IngeCrudService } from 'src/app/pure/services/inge-crud.service';
import { AaService } from 'src/app/base/services/aa.service';
import { DateAggregation, NestedAggregation, TermsAggregation } from 'src/app/shared/model/aggs-params';
import { AggregationService } from 'src/app/shared/services/aggregation.service';
import { FacetComponent } from 'src/app/shared/components/facet/facet.component';
import { NavigationEnd, Router } from '@angular/router';
import { FacetComponent as FacetComponent_1 } from 'src/app/shared/components/facet/facet.component';
import { ListItemViewComponent } from './list-item-view/list-item-view.component';
import { NgClass, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationDirective } from 'src/app/shared/directives/pagination.directive';

@Component({
  selector: 'wfvs-pure',
  templateUrl: './pure.component.html',
  styleUrls: ['./pure.component.scss'],
  standalone: true,
  imports: [
    PaginationDirective,
    FormsModule,
    NgClass,
    NgFor,
    NgIf,
    ListItemViewComponent,
    FacetComponent_1,
    AsyncPipe,
  ],
})
export class PureComponent implements OnInit, AfterViewInit {

  @ViewChildren(FacetComponent) facets!: QueryList<FacetComponent>;

  result_list: Observable<ItemVersionVO[]> | undefined;
  number_of_results: number | undefined;

  // Facets
  genre_obs!: Observable<any[]>;
  publisher_obs!: Observable<any[]>;
  created_obs!: Observable<any[]>;

  // Pagination:
  page_size = 10;
  number_of_pages = 1;
  current_page = 1;

  update_query = (query: any) => {
    return {
      query,
      size: this.page_size,
      from: 0
    }
  }

  current_query: any;

  constructor(
    private service: IngeCrudService,
    public aa: AaService,
    private aggs: AggregationService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const publishers: TermsAggregation = {
      terms: {
        field: 'metadata.sources.title.keyword',
        order: { _count: 'desc' },
        size: 250
      }
    };

    const created: DateAggregation = {
      date_histogram: {
        field: 'creationDate',
        calendar_interval: 'year',
        format: 'yyyy'
      }
    };

    const nested: NestedAggregation = {
      nested: {
        path: 'metadata.sources'
      },
      aggregations: { publishers }
    };

    const genre: TermsAggregation = {
      terms: {
        field: 'metadata.genre',
        order: {
          _key: 'asc'
        },
        size: 100
      }
    };

    this.publisher_obs = this.aggs.getBuckets_from_pure({ nested });
    this.created_obs = this.aggs.getBuckets_from_pure({ created });
    this.genre_obs = this.aggs.getBuckets_from_pure({ genre });
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately. 
      startWith(this.router)
    ).subscribe(() => {
      const query = history.state.query;
      if (query) {
        // this.current_query = this.update_query({ query_string: { query: query_string } })
        this.current_query = this.update_query(query);
        this.items(this.current_query);
      } else {
        this.current_query = this.update_query({ bool: { filter: [] } });
        this.items(this.current_query);
      }
    });
  }

  items(body: any) {
    let token = undefined;
    if (this.aa.token) token = this.aa.token;
    this.result_list = this.service.search('/items', body, token).pipe(
      tap(result => {
        this.number_of_results = result.numberOfRecords;
        this.number_of_pages = Math.ceil(this.number_of_results / this.page_size)
      }),
      map(result => result.records?.map(record => record.data))
    );
  }

  show(item: ItemVersionVO) {
    // alert(JSON.stringify(item, undefined, 2));
    this.router.navigate(['edit', item.objectId])
  }

  select_pages(total: number): Array<number> {
    const elems = 7;
    if (total < elems) {
      return [...Array(total).keys()];
    }
    const left = Math.max(0, Math.min(total - elems, this.current_page - Math.floor(elems / 2)));
    const items = Array(elems);
    for (let i = 0; i < elems; i += 1) {
      items[i] = i + left;
    }
    if (items[0] > 0) {
      items[0] = 0;
      items[1] = '...';
    }
    if (items[items.length - 1] < total - 1) {
      items[items.length - 1] = total - 1;
      items[items.length - 2] = '...';
    }

    return items;
  }

  isNumber(val: any): boolean { return typeof val === 'number'; }

  onPageChange(page_number: number) {
    this.current_page = page_number;
    const from = page_number * this.page_size - this.page_size;
    this.current_query.size = this.page_size;
    this.current_query.from = from;
    this.items(this.current_query);
  }

  pageSizeHandler(event: any) {
    const relocate = this.current_page * this.page_size;
    this.page_size = Number.parseInt(event.target.value);
    this.number_of_pages = this.number_of_results ? Math.ceil(this.number_of_results / this.page_size) : 0;
    if (relocate < this.page_size || relocate > this.number_of_pages) {
      this.current_page = 1;
    } else {
      this.current_page = Math.floor(relocate / this.page_size);
    }
    this.onPageChange(this.current_page);
  }


  facetNotice() {
    const query = this.facets.reduce((acc, facet) => {
      let query_term;
      if (facet.item_list.length === 1) {
        const field = facet.term_query_field;
        let value;
        if (field.localeCompare('creationDate') === 0) {
          value = facet.item_list[0].key_as_string.concat('-01-01||/y') || facet.item_list[0].key.concat('-01-01||/y');
        } else {
          value = facet.item_list[0].key_as_string || facet.item_list[0].key;
        }
        query_term = {
          term: {
            [field]: value
          }
        };
        acc.query.bool.filter.push(query_term);
      }
      return acc;
    }, { query: { bool: { filter: Array<any>() } } })

    if (query.query.bool.filter.length === 0) {
      const term = {
        term: {
          publicState: 'RELEASED'
        }
      };
      query.query.bool.filter.push(term);
    }
    this.current_page = 1;
    this.current_query = this.update_query(query.query);
    this.items(this.current_query);
  }
}
