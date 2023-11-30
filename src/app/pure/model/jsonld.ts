export interface JsonLDGraph {
    // [key: string]: any,
    '@graph': JsonLD[];
    '@context': Record<string, unknown>;
}

export interface JsonLD {
    '@id': string;
    '@context': Record<string, unknown>;
}

interface RDFTerm {
    type: 'uri' | 'literal' | 'bnode';
    value: string;
}

export interface SparqlJsonResult {
    head: {
        vars: string[];
        link?: string[];
    };
    results: {
        bindings: {[key: string]: RDFTerm}[];
    };
}

export interface Collection extends JsonLD {
    AdditionalInfo?: string[];
    linkedCollection?: string;
    doi?: string;
    modifiedBy: string;
    status: string;
    description: string;
    title: string;
    created: Date;
    creator: string;
    issued: Date;
    modified: Date;
    type: string | string[];
    'foaf:person': {'@id': string}[] | {'@id': string};
}

export enum CollectionType {
    experimental,
    observational,
    survey
}

export interface AdditionalInfo extends JsonLD {
    text: string;
    label: string;
}

export interface LinkedCollection extends JsonLD {
    text: string;
    description: string;
    title: string;
    type: string;
}

export interface ImejiUser extends JsonLD {
    userStatus: string;
    email: string;
    password: string;
    'foaf:person': {'@id': string}[] | {'@id': string};
}

export interface ImejiPerson extends JsonLD {
    orcid: string;
    'family-name': string;
    'given-name': string;
    'meta:organizationalunit': {'@id': string}[] | {'@id': string};
}

export interface ImejiOU extends JsonLD {
    title: string;
    department?: string;
}

export interface Item extends JsonLD {
    filename: string;
    filetype: string;
    'terms/fileSize': number;
}

export interface ItemInfo {
    id: string;
    name: string;
    size: number;
    type: string;
    path: string;
    url?: string;
    part_size?: number;
    storage_id?: string;
    etag?: string;
    final_result?: any;
}