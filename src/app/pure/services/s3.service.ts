import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(
    private http: HttpClient
  ) { }

  list(prefix: string) {
    if (prefix) {
      const params = new HttpParams().set( 'prefix', prefix);
      return this.http.get<object[]>(environment.dowm_url.concat('/pure/s3'), { params });
    } else {
      return this.http.get<object[]>(environment.dowm_url.concat('/pure/s3'));
    }
  }
}
