interface Event {
    pk: string,
    name: string,
    description: string,
    url: string,
    additional: string,
    location: string,
    longitude: number,
    latitude: number,
    start: number,
    end: number,
    timestamp: number,
    categories: string[],
    firstYearRequired: boolean,
    transferRequired: boolean
}

export {
    Event
}