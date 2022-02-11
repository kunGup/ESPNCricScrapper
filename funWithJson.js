let fs=require('fs')
let buffer = fs.readFileSync('./example.json')  //read the JSON file
let xlsx=require('xlsx')
let data = JSON.parse(buffer)   //converts the buffer data into JSON format

// data.push({
//     "name": "thor",
//     "lastName": "odinson",
//     "isAvenger": true,
//     "age": 1000,
//     "friends": ["bruce", "tony", "peter"],
//     "address": {
//       "planet": "asgard"
//     }
// });

let data2=require('./example.json')

// data2.push({
//     "name": "bruce",
//     "lastName": "banner",
//     "isAvenger": true,
//     "age": 1000,
//     "friends": ["bruce", "tony", "peter"],
//     "address": {
//       "planet": "asgard"
//     }
// })

// console.log(data2);

// let stringData=JSON.stringify(data2)
// fs.writeFileSync('./example.json',stringData)


// let newWB = xlsx.utils.book_new();
// //add new workbook

// let newWS = xlsx.utils.json_to_sheet(data2);
// //this will take JSON and will convert into Excel format

// xlsx.utils.book_append_sheet(newWB, newWS, 'Avengers');
// xlsx.writeFile(newWB, 'abc.xlsx');

let wb = xlsx.readFile('./abc.xlsx');
// which excel file to read
let excelData = wb.Sheets['Avengers'];
// pass the sheet name
let ans = xlsx.utils.sheet_to_json(excelData);
// converting from sheet to json
console.log(ans);