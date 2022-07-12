// run faces analyter on AWS rekognition

import fs from 'fs'

const nameToParty = JSON.parse(fs.readFileSync('nameToParty.json', 'utf8'))

const ROWS = []
const folders = fs.readdirSync('images');
const EMOTION = new Set()
const imageData = {}

for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    const data = {}
    let numberOfSingleFaceImage = 0
    const imgData = []
    for (const file of files) {
        if (!file.endsWith('.json')) continue
        // console.log(`${folder}/${file}`);
        const imageJsonData = JSON.parse(fs.readFileSync(`images/${folder}/${file}`, 'utf8'));
        // detectFace(`${folder}/${file}`);
        const numberOfFaces = imageJsonData.FaceDetails.length;
        if(numberOfFaces !== 1) continue
        const imageEmotion = {}
        for (let i in imageJsonData.FaceDetails[0].Emotions) {
            let { Type, Confidence } = imageJsonData.FaceDetails[0].Emotions[i];
            EMOTION.add(Type)
            if(!data[Type]) data[Type] = 0
            Confidence = Math.round(Confidence * 100) / 100
            data[Type] += Confidence
            imageEmotion[Type] = Confidence
        }
        const url = `https://election-2022.s3.eu-west-1.amazonaws.com/${folder}/${file.replace('.json', '')}`
        imgData.push({
            url,
            ...imageEmotion
        })
        numberOfSingleFaceImage++
    }
    imageData[folder] = imgData
    // console.log(data)
    for (let i in data) {
        data[i] = data[i] / numberOfSingleFaceImage
        // round number to 2 decimal places
        data[i] = Math.round(data[i] * 100) / 100
    }
    data.name = folder
    data.party = nameToParty[folder]
    ROWS.push(data)

}
const EMOTION_LIST = [...EMOTION]
const COLS = [{
    label: 'name',
    field: 'name',
},{
    label: 'party',
    field: 'party',
}]

for(const emotion of EMOTION_LIST) {
    COLS.push({
        label: emotion,
        field: emotion,
    })
}

fs.writeFileSync('basic-stat/src/basicStatTableData.json', JSON.stringify({
    rows: ROWS,
    columns: COLS,
    imageData
}, null, 2));