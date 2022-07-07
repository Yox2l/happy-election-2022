const fs = require('fs');
const lines = fs.readFileSync('list').toString().split('\n');
let HK = []
for (const line of lines) {
    // HK = HK.concat(line.trim().split(','))
    for (const s of line.trim().split(',')) {
        if(s.trim() != '')
            HK.push(s.trim())
    }
    // console.log(line.trim())
}
// console.log(JSON.stringify(HK, null, 2));
for (const h of HK) {
    // run os command
    if(h.indexOf('"') > -1) {
        console.log(`node download.js '${h}'`)    
    } else {
        console.log(`node download.js "${h}"`)
    }
    // console.log(`node download.js '${h}'`)
    // console.log(`node download.js "${h.replace('"', '\"')}"`)
}