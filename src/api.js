import fetch from "isomorphic-fetch";

export function fetchApiData( ) {
    return fetch( "https://rickandmortyapi.com/api/character/" )
        .then( res => res.json( ) )
        .then( res => res.results );
}
