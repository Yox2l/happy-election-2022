const fs = require('fs');
const lines = fs.readFileSync('list').toString().split('\n');
let HK = []
for (const line of lines) {
    for (const s of line.trim().split(',')) {
        if(s.trim() != '')
            HK.push(s.trim())
    }
}
for (const h of HK) {
    // run os command
    if(h.indexOf('"') > -1) {
        console.log(`node download.js '${h}' &`)    
    } else {
        console.log(`node download.js "${h}" &`)
    }
}