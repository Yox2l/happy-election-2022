// run faces analyter on AWS rekognition

import { RekognitionClient, SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";
import fs from 'fs'

const faceDict = JSON.parse(fs.readFileSync('face_dict.json', 'utf8'));

const REGION = "eu-west-1"; 
const rekogClient = new RekognitionClient({
    region: REGION,
    'profile': 'personal'
});

const BUCKET = 'election-2022'

let activeDownload = 0
const MAX_ACTIVE_DOWNLOAD = 10
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SearchInImage = async (photoName) => {
    try {
        // return
        const params = {
            CollectionId: 'kneset24',
            Image: {
                S3Object: {
                    Bucket: BUCKET,
                    Name: photoName
                },
            },
            FaceMatchThreshold:90,
            MaxFaces:1000
        }
        const response = await rekogClient.send(new SearchFacesByImageCommand(params));
        const userSet = new Set();
        for (const face of response.FaceMatches) {
            const faceID = face.Face.FaceId;
            console.log(faceID);
            const user = faceDict[faceID];
            if (user) {
                userSet.add(user);
            }
        }
        console.log(photoName)
        fs.writeFileSync(`images/${photoName}.user_set.json`, JSON.stringify([...userSet], null, 2));
        fs.writeFileSync(`images/${photoName}.serach_result.json`, JSON.stringify(response, null, 2));
        console.log(response)
    } catch (err) {
        console.log("Error", err);
    }
    activeDownload--
};


const folders = fs.readdirSync('images');

for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    const data = {}
    let numberOfSingleFaceImage = 0
    for (const file of files) {
        if (!file.endsWith('.json')) continue
        if (file.endsWith('detection.json')) continue
        const imageJsonData = JSON.parse(fs.readFileSync(`images/${folder}/${file}`, 'utf8'));
        const numberOfFaces = imageJsonData.FaceDetails.length;
        if(numberOfFaces === 1) continue
        SearchInImage(`${folder}/${file.replace('.json', '')}`);

    }
}

// const x = "נפתלי בנט/9_מעריב‎.png"
// SearchInImage(x)