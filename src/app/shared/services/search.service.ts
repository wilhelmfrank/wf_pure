import { Injectable } from '@angular/core';
import { SearchRequest, SearchTerm } from '../components/search-term/search.term';

interface bool_query {
  bool: {
    [key: string]: any,
  }
}

@Injectable()
export class SearchService {

  bool = (request: SearchRequest) => {
    const boolquery = {
      bool: {}
    };
    if (request.searchTerms[0].clause) {
      return request.searchTerms.reduce((q: bool_query, term: SearchTerm) => {
        const {clause, field, searchTerm, type} = term;
        if (!q.bool[clause]) {
          q.bool[clause] = [];
        }
        if (field.includes('auto')) {
          q.bool[clause].push(this.search_as_you_type(field, searchTerm));
          return q;
        } else {
          q.bool[clause].push({[type]: {[field]: searchTerm}});
          return q;
        }
      }, boolquery);
    }
    return boolquery;
  }

  search_as_you_type(f: string, v: string) {
    return {
      multi_match: {
        query: v,
        type: 'bool_prefix',
        fields: [
          f
        ]
      }
    }
  }
}
