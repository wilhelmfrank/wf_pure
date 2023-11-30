export interface SearchRequest {
    searchTerms: SearchTerm[];
}

export interface SearchTerm {
    clause: string;
    type: string;
    field: string;
    searchTerm: string;
    fields: string[];
}
