import puppeteer from 'puppeteer';
import { mongo } from '../../database/mongodb';
import { Beer } from '../../database/collections/beer';
import { Brewery } from '../../database/collections/brewery';
import { Db, MongoDBNamespace, ObjectId } from 'mongodb';



export module getBreweryInfo {
    let browser;
    let db; 
    export async function getBreweries(currentPage: number = 1, page: puppeteer.Page) {
        const url = `https://birrapedia.com/breweries/${currentPage}/ie-7061776f`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
         const allBreweries = await page.evaluate( ()=> {
            return [...document.querySelectorAll(`.detalle-bloque-cuerpo > a`)].map((el: any) => el.href);

        })
        const breweriesDetails = [];
        console.log(allBreweries);
        for (const brewery of allBreweries) {
            const breweryDetails = await getAllBreweryDetails(brewery, page);
            breweriesDetails.push(breweryDetails);
        }
        return breweriesDetails;
    };
    export async function startBrowser() {
        browser = await puppeteer.launch();
        db = await initDb();
        return browser.newPage();
    }
    export async function endBrowser(){
        browser.close();
    }
    export async function getAllBreweryDetails (brewery: string, page: puppeteer.Page) {
        await page.goto(brewery, { waitUntil: 'domcontentloaded' });
        const completeDetails = await page.evaluate(()=> {
            const name = document.querySelector('.detalle-bloque66 h1').textContent;
            const description = document.querySelector('#info .text-muted.mt-1').textContent;
            const images = [...document.querySelectorAll('.detalle-bloque33 img')].map((element: any) => element.src);
            const where = [...document.querySelectorAll('.detalle-bloque66 .mt-0 a')].map((element: any) => element.textContent);
            const country = where[0];
            const location = where[1] || '';
            const beersElement = document.querySelector('.mdl-tabs .mdl-badge');
            const beers = beersElement ? parseInt(beersElement.getAttribute('data-badge')) : 0;
            const beersList = [...document.querySelectorAll('#cervezas .lista-cab.cursor-pointer')].map((element) => element.getAttribute('onclick').split('\"')[1]);
            const url = '';
            return { url, name, description, images, country, location, beers, beersList };
        });
        completeDetails.url = brewery;
        console.log(completeDetails.beers);
        const beerList = completeDetails.beersList;
        delete completeDetails.beersList;
        const beerCollection = initBeerCollection(db);
        const breweryCollection = initBreweryCollection(db);
        let breweryMongo: any;
        try {
            breweryMongo = await breweryCollection.insert(completeDetails);
        } catch (error) {
            console.error(error);
            const mongoResult = await breweryCollection.get({ name: completeDetails.name });
            breweryMongo = {
                insertedId: mongoResult.id
            }
        }
        for (const beer of beerList) {
            const beerItem = await getAllBeerDetails(beer, page);
            beerItem.brewery = breweryMongo.insertedId;
            beerItem.breweryName = completeDetails.name;
            try {
                await beerCollection.insert(beerItem);
            } catch (error) {
                console.error(error);
            }
        }
        return completeDetails;
    }
};


async function getAllBeerDetails (beer: string, page: puppeteer.Page) {

    try {
        await page.goto(beer, { waitUntil: 'domcontentloaded' });
        const completeDetails = await page.evaluate(()=> {
            const cabecera = document.querySelector('.cabecera-bloque');
            const imagenes = document.querySelector('.detalle-bloque33');
            const detalles = cabecera.querySelector('.detalle-bloque66.m-0.p-0.ml-1');
            if (imagenes && detalles){
                const name = detalles.querySelector('.mdl-typography--title-color-contrast.m-0.p-0').textContent;
                const description = detalles.querySelector('.text-muted').textContent;
                let images = [...imagenes.querySelectorAll('img')].map((element: any) => element.src)
                images = images.filter((element: any) => !element.includes('untappd'));
                const style = detalles.querySelector('.mt-0 > .mr-1 a').textContent;
                const breweryName = detalles.querySelector('.mt-1').textContent;
                const rating = [...imagenes.querySelectorAll('.cabecera-bloque-row')].map((element: any) => parseFloat(element.querySelector('strong').textContent.split(' ')[0].replace(',','.')));
                const ratingScore = (rating.length > 1 && rating[0]) || 0;
                const ratingNumber = (rating.length > 1 && rating[1]) || (rating[0] || 0);
                let alchol = -1;
                let ibu = -1;
                const alcholItem = detalles.querySelector('.mt-0 :nth-child(2)');
                if (alcholItem){
                    alchol = parseFloat(alcholItem.textContent.split(' ')[0].replace(',','.'));
                }
                const ibuItem = detalles.querySelector('.mt-0 :nth-child(3)');
                if (ibuItem){
                    ibu = parseFloat(ibuItem.textContent.split(' ')[0]);
                }
                const ofertas = document.querySelector('#ofertas')
                let prices = [];
                if (ofertas) {
                    const moreImgs = [...ofertas.querySelectorAll('.lista-img img')].map((elem: any) => elem.src);
                    images.push(...moreImgs);
                    prices = [...ofertas.querySelectorAll('.lista-texto > .texto-derecha > .colorRojo')].map((element) => parseFloat(element.textContent.split(' ')[0].replace(',','.')));
                }
                const url = '';
                let brewery: ObjectId;
                return { url, name, style, alchol, breweryName, brewery, ibu,  description, images, untappedMark: { ratingScore, ratingNumber },  prices };
            } else {
                const name = document.querySelector('h1').textContent.trim();
                let brewery: ObjectId;
                return { url: '', name, style: '', alchol: 0, breweryName:'', brewery, ibu: 0,  description: '', images: [], untappedMark: { ratingScore: 0, ratingNumber: 0 },  prices: [] }
            }
        });
        completeDetails.url = beer;
        return completeDetails;
      } catch (e) {
        if (e instanceof puppeteer.errors.TimeoutError) {
        let brewery: ObjectId;
          return { url: '', name: 'error loading page', style: '', alchol: 0, breweryName:'', brewery, ibu: 0,  description: '', images: [], untappedMark: { ratingScore: 0, ratingNumber: 0 },  prices: [] }
        }
      }
    
}

async function initDb() {
    return mongo.init();
}
function initBeerCollection(database: Db) {
    return new Beer(database);
}
function initBreweryCollection(database: Db) {
    return new Brewery(database);
}