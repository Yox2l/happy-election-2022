// run faces analyter on AWS rekognition

import fs from 'fs'

const folders = fs.readdirSync('images');
const DATA = {}
for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    const data = {}
    for (const file of files) {
        if (!file.endsWith('detection.json')) continue
        const imageJsonData = JSON.parse(fs.readFileSync(`images/${folder}/${file}`, 'utf8'));
        const numberOfFaces = imageJsonData.FaceRecords.length;
        if(numberOfFaces !== 1) continue
        const faceID = imageJsonData.FaceRecords[0].Face.FaceId;
        console.log(`${folder}/${file.replace('.json', '')} ${faceID}`);
        DATA[faceID] = folder
    }
}
// write data to file
fs.writeFileSync('face_dict.json', JSON.stringify(DATA, null, 2));