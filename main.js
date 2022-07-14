const keyboards = require('./products/keyboards');
const breweries = require('./catalog/breweries/scraping-birrapedia');
const utils = require('./utils');
const mongodb = require('./database/mongodb');
const kafka = require('./utils/kafka/kafka');
const dbCollections = require('./database/collections');
(async () => {
    const breweryInfo = breweries.getBreweryInfo(1);
    console.table(breweryInfo);
    // const mechanicalkeyboards_keyboards = await keyboards.mechanicalkeyboardsKeyboards(3);
    // const keyboardsCollection = await mongodb.getCollection('keyboards');
    // await keyboardsCollection.insertMany([...mechanicalkeyboards_keyboards]);
    // console.log(JSON.stringify(mechanicalkeyboards_keyboards));
    // utils.setPages();
    // const allPages = await pages.getAllPages()
    // const favicon = await pages.getFavicon(allPages[0].webs[10]);
    // console.log(favicon);
    // await kafka.init();
    // const testProducer = await kafka.getProducer();
    // await kafka.producerSend({ producer: testProducer, messages: [{ value: 'A a a a aanooother falls' },{ value: 'youuuu foool' }]})
    // const testConsumer = await kafka.getConsumer('something-2');
    // await kafka.consumerSubscribe({consumer: testConsumer, topic: 'test-topic', callback: async ({ topic, partition, message }) => {
    //     console.log({
    //       value: message.value.toString(),
    //     })
    //   }})


    // Using a single function to handle multiple signals
    function handle(signal) {
        console.log(`Received ${signal}`);
        kafka.disconnect();
        mongodb.close();
    }

    process.on('SIGINT', handle);
    process.on('SIGTERM', handle);
})();