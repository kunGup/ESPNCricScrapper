const cheerio = require("cheerio");
const request = require("request");
const path=require('path')
const fs=require('fs')
const xlsx=require('xlsx')

function processScorecard(url){
  request(url, cb);
}

function cb(error,response,html){
    if(error){
        console.log(error);
    }else{
        extractDetails(html);
    }
}
function extractDetails(html){
    let $ = cheerio.load(html);
    let descElem = $(".header-info .description");
    let resultElem = $(
      ".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text"
    );
    let result=resultElem.text()
    let str = descElem.text()
    let strArr = str.split(', ')
    let venue=strArr[1]
    let date=strArr[2]
    console.log(venue);
    console.log(date);
    console.log(result);
    console.log("`````````````````````````````````````");
    let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlString=''

    for(let i=0;i<innings.length;i++){
      htmlString+=$(innings[i]).html()
      let teamName = $(innings[i]).find('h5').text();
      teamName=teamName.split('INNINGS')[0].trim()
      let oppIdx=i==0?1:0
      let opponentName = $(innings[oppIdx]).find("h5").text();
      opponentName = opponentName.split("INNINGS")[0].trim();

      let cInning=$(innings[i])
      let allRows=cInning.find('.table.batsman tbody tr')
      for(let j=0;j<allRows.length;j++){
        let allCols = $(allRows[j]).find('td')
        let isWorthy = $(allCols[0]).hasClass('batsman-cell')
        if(isWorthy==true){
          let playerName = $(allCols[0]).text().trim();
          let runs = $(allCols[2]).text().trim();
          let balls = $(allCols[3]).text().trim();
          let fours = $(allCols[5]).text().trim();
          let sixes = $(allCols[6]).text().trim();
          let STR = $(allCols[7]).text().trim();

          console.log(
            `${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR}`
          );
          processPlayer(
            teamName,
            playerName,
            runs,
            balls,
            fours,
            sixes,
            STR,
            opponentName,
            venue,
            result,
            date
          );

        }
      }
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,STR,opponentName,venue,result,date){
  let teamPath = path.join(__dirname,"IPL",teamName)
  dirCreator(teamPath)
  let filePath = path.join(teamPath,playerName+".xlsx")
  let content = excelReader(filePath,playerName)
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    opponentName,
    venue,
    result,
    date,
  };
  content.push(playerObj)
  excelWriter(filePath,content,playerName)
}

function excelWriter(filePath,jsonData,sheetName){
  let newWB = xlsx.utils.book_new();
  //add new workbook

  let newWS = xlsx.utils.json_to_sheet(jsonData);
  //this will take JSON and will convert into Excel format

  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath,sheetName){
  if (fs.existsSync(filePath) == false) {
    return [];
  }
  let wb = xlsx.readFile(filePath);
  // which excel file to read
  let excelData = wb.Sheets[sheetName];
  // pass the sheet name
  let ans = xlsx.utils.sheet_to_json(excelData);
  // converting from sheet to json
  return ans
}

function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}

module.exports = {
  ps:processScorecard
}