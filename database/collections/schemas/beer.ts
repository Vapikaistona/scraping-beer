import { ObjectId } from "mongodb";

export class BeerSchema{
    url: string;
    name: string;
    style: string;
    alchol: number;
    brewery: ObjectId;
    breweryName: string;
    ibu: number;
    description: string;
    images: string[];
    prices: number[];
    untappedMark: {
        ratingScore: number,
        ratingNumber: number
    };

    constructor(objParam: any){
        const {
            url,
            name,
            style,
            alchol,
            brewery,
            breweryName,
            ibu,
            description,
            images,
            prices,
            untappedMark
        } = objParam;
        this.url = url;
        this.name = name;
        this.style = style;
        this.alchol = alchol;
        this.brewery = brewery;
        this.breweryName = breweryName;
        this.ibu = ibu;
        this.description = description;
        this.images = images;
        this.prices = prices;
        this.untappedMark = untappedMark;
    }
}