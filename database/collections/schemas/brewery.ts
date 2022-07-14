export class BrewerySchema{
    url: string;
    name: string;
    description: string;
    images: string[];
    country: string;
    location: string;
    beers: number;
    
    constructor(objParam: any){
        const {
            url,
            name,
            description,
            images,
            country,
            location,
            beers,
        } = objParam;
        this.url = url;
        this.name = name;
        this.description = description;
        this.images = images;
        this.country = country;
        this.location = location;
        this.beers = beers;
    }
}