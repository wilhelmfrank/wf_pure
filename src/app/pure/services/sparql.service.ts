import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonLD, SparqlJsonResult } from '../model/jsonld';

@Injectable({
  providedIn: 'root'
})
export class SparqlService {

  fuseki = 'http://localhost:3030/imeji';
  headers =  new HttpHeaders({ 'Content-Type': 'application/json' });
  

  constructor(
    private http: HttpClient
  ) { }

  resource<T extends JsonLD>(query: any): Observable<T> {
    const format = 'json';
    const params = new HttpParams().set( 'format', format).set('query', query);
    return this.http.get<T extends JsonLD ? any: T>(this.fuseki,{params}).pipe(
      map(response => {return response})
    );
  }

  result(query: any): Observable<SparqlJsonResult> {
    const format = 'json';
    const params = new HttpParams().set( 'format', format).set('query', query);
    return this.http.get<SparqlJsonResult>(this.fuseki,{params}).pipe(
      map(response => {return response})
    );
  }
}
