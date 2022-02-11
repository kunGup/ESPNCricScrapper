let url = "https://www.espncricinfo.com/series/ipl-2021-1249214";
const cheerio=require('cheerio')
const request=require('request')
const allMatchObj = require('./Allmatch')
const path=require('path')
const fs=require('fs')
let iplPath=path.join(__dirname,"IPL")
dirCreator(iplPath)
request(url,cb)

function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        extractLink(html);
    }
}

function extractLink(html){
    let $=cheerio.load(html)
    let anchorElement=$('a[data-hover="View All Results"]')
    let link=anchorElement.attr('href')
    let fullLink = "https://www.espncricinfo.com/"+link;
    allMatchObj.getAllMatch(fullLink);
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath)
    }
}