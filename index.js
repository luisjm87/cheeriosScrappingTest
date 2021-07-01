const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require('fs-extra');
const writeStream = fs.createWriteStream('quotes.csv');

const URL = "https://quotes.toscrape.com";
let getData = async () => {
    const $ = await request({
        uri: URL,
        transform: body => cheerio.load(body)
    });
    writeStream.write('Quote|Author|Tags\n');
    $('.quote').each((i, el) => {
        const tags = [];
        const text = $(el).find('span.text').text().replace(/(^\“|\”$)/g, "");
        const author = $(el).find('span small.author').text();
        const tag = $(el).find('.tags a.tag').each((index, e) => {
            tags.push($(e).text());
        });
        console.log(`Quote: ${text},Author:  ${author}, Tags: ${tags.join(", ")} \n`);
        writeStream.write(`${text}|${author}|${tags}\n`);
    })
}

getData();