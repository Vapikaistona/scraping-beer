// import { pages } from './utils/PagesInfo';
import {getBreweryInfo} from './catalog/breweries/scraping-birrapedia'; 

(async () => {
    const page = await getBreweryInfo.startBrowser();
    // for (let index = 2; index < 225; index++) {
    //     await getBreweryInfo.getBreweries(index, page);
        
    // }
    //await getBreweryInfo.getAllBreweryDetails('https://birrapedia.com/laugar-brewery/e-52f1f0cbd187e42463000010',page);
    await getBreweryInfo.getBreweries(3, page);
    await getBreweryInfo.endBrowser();
    console.info('finished!!!')
    function handle(signal) {
        console.log(`Received ${signal}`);
        process.exit();
    }

    process.on('SIGINT', handle);
    process.on('SIGTERM', handle);
})();