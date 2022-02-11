const cheerio = require('cheerio')
const request = require('request')
const scorecard = require('./scorecard')

function getAllMatchLink(url) {
  request(url, cb);

  function cb(error, response, html) {
    if (error) {
      console.log(error);
    } else {
      extractAllMatchLink(html);
    }
  }
}
function extractAllMatchLink(html) {
  let $ = cheerio.load(html);
  let scoreCardElemArr = $('a[data-hover="Scorecard"]');
  for (let i = 0; i < scoreCardElemArr.length; i++) {
    let link = $(scoreCardElemArr[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com/" + link;
    console.log(fullLink);
    scorecard.ps(fullLink)
  }
}

module.exports = {
  getAllMatch: getAllMatchLink,
};