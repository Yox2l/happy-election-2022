const fs = require('fs');

const lines = fs.readFileSync('list', 'utf8').split('\n');
const result = {};
for (const line of lines) {
    const sp = line.split('\t')
    for (const name of sp[2].split(',')) {
        result[name.trim()] = sp[0].trim()
    }
}
fs.writeFileSync('nameToParty.json', JSON.stringify(result, null, 2));