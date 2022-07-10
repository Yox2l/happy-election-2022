const fs = require('fs');
const lines = fs.readFileSync('list').toString().split('\n');
let HK = []
for (const line of lines) {
    for (const s of line.trim().split(',')) {
        if(s.trim() != '')
            HK.push(s.trim())
    }
}

fs.writeFileSync('kenest_2022.json', JSON.stringify(HK, null ,2))