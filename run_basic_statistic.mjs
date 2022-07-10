// run faces analyter on AWS rekognition

import fs from 'fs'


const DATA = {}
const folders = fs.readdirSync('images');
const EMOTION = new Set()

for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    const data = {}
    let numberOfSingleFaceImage = 0
    for (const file of files) {
        if (!file.endsWith('.json')) continue
        // console.log(`${folder}/${file}`);
        const imageJsonData = JSON.parse(fs.readFileSync(`images/${folder}/${file}`, 'utf8'));
        // detectFace(`${folder}/${file}`);
        const numberOfFaces = imageJsonData.FaceDetails.length;
        if(numberOfFaces !== 1) continue
        for (let i in imageJsonData.FaceDetails[0].Emotions) {
            const { Type, Confidence } = imageJsonData.FaceDetails[0].Emotions[i];
            EMOTION.add(Type)
            if(!data[Type]) data[Type] = 0
            data[Type] += Confidence
        }
        numberOfSingleFaceImage++
    }
    // console.log(data)
    for (let i in data) {
        data[i] = data[i] / numberOfSingleFaceImage
    }
    // console.log(data)
    DATA[folder] = data
    // break
}
// fs.writeFileSync('basicStat.json', JSON.stringify(DATA, null, 2));
// console.log(DATA)
// console.log(EMOTION)
const EMOTION_LIST = [...EMOTION]
let TXT = 'name,'
const line = []
for(const emotion of EMOTION_LIST) {
    line.push(emotion)
}
TXT += line.join(',') + '\n'
for(const name in DATA) { 
    console.log(name)
    const data = DATA[name]
    const line = [name]
    for(const emotion of EMOTION_LIST) {
        line.push(data[emotion])
    }
    TXT += line.join(',') + '\n'
    // console.log(line)
}
fs.writeFileSync('basicStat.csv', TXT);
