import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DvService {

  constructor(
    private http: HttpClient
  ) { }

  list(query: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Dataverse-key', '7c3de410-074e-455f-808c-bbd5305c6538');
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'dataset')
      .set('per_page', 11);
    return this.http.get('https://edmond.mpg.de/api/search', { headers, params });
  }
}
