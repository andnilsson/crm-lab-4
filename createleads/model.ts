
export interface Lead {
    firstname: string;
    lastname: string;    
    telephone1: string;
    budgetamount: number;
    emailaddress1: string;
    entityimage: string;
    subject: string;
}


export interface Name {
    title: string;
    first: string;
    last: string;
}

export interface Location {
    street: string;
    city: string;
    state: string;
    postcode: number;
}

export interface Id {
    name: string;
    value: string;
}

export interface Picture {
    large: string;
    medium: string;
    thumbnail: string;
}

export interface Person {
    gender: string;
    name: Name;
    location: Location;
    email: string;
    dob: string;
    registered: string;
    phone: string;
    cell: string;
    id: Id;
    picture: Picture;
    nat: string;
}

export interface Info {
    seed: string;
    results: number;
    page: number;
    version: string;
}

export interface RootObject {
    results: Person[];
    info: Info;
}



