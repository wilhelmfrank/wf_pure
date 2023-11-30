const prefixes = `
prefix : <http://imeji.org/>
prefix imeji: <http://imeji.org/terms/>
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix person: <http://xmlns.com/foaf/0.1/person/>
prefix organizationalunit: <http://purl.org/escidoc/metadata/profiles/0.1/organizationalunit/>
prefix item: <http://edmond.mpdl.mpg.de/imeji/item/>
prefix collection: <http://edmond.mpdl.mpg.de/imeji/collection/>
prefix user: <http://edmond.mpdl.mpg.de/imeji/user/>
prefix meta: <http://purl.org/escidoc/metadata/profiles/0.1/>
prefix dc: <http://purl.org/dc/elements/1.1/>
prefix dcterms: <http://purl.org/dc/terms/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
`;

const WITHDRAWN = '<http://imeji.org/terms/status#WITHDRAWN>';

export const describe = (prefixed_id: string): string => {
    return `
    ${prefixes}
    describe ${prefixed_id}
    `
};

export const describe_all = (prefixed_id: string): string => {
    return `
    ${prefixes}
    describe $collection $author $unit $creature $creature_unit $info $linked
    from :collection
    from :user  
    where {
      $collection foaf:person $author;
	        	dcterms:creator $creator.
      optional {$collection :AdditionalInfo $info}.
      optional {$collection :linkedCollection $linked}.
      $author meta:organizationalunit $unit.
      $creator foaf:person $creature.
      $creature meta:organizationalunit $creature_unit.
      values $collection {${prefixed_id}}
    }
    `
};

export const collections = () => {
    return `
    ${prefixes}
    select $c $title
    from :collection
    where {
      $c a imeji:collection.
      $c dc:title $title.
      optional {$c imeji:collection $mother}.
      filter (!bound($mother))
    } group by $c $title order by $title
    `
}

export const select_info = (collection_id: string): string => {
    return `
    ${prefixes}
    select $label $text
    from :collection
    where {
        ${collection_id} :AdditionalInfo $info.
        $info rdfs:label $label;
              imeji:text $text.
    }
    `
};

export const describe_info = (collection_id: string): string => {
    return `
    ${prefixes}
    describe $info
    from :collection
    where {
        ${collection_id} :AdditionalInfo $info.
    }
    `
};

export const items_4_collection = (collection_id: string): string => {
    return `
    ${prefixes}
    select $element
    from :collection
    from :item
    where {
        $element imeji:collection+ ${collection_id}.
        $element a imeji:item.
        $element imeji:status $state.
        filter (?state != ${WITHDRAWN})
    }
    `
};

export const path_4_file = (item_id: string): string => {
    return `
    ${prefixes}
    select ?collection_title (count(?steps) as ?step)
    from :collection
    from :item
    {
        ?item imeji:collection* ?steps .
        ?steps imeji:collection+/dc:title ?collection_title .
        values ?item {item:${item_id}}
    }
    group by ?collection_title
    order by ?step
    `
};



