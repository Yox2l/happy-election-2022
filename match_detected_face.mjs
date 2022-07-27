import { RekognitionClient, SearchFacesCommand } from "@aws-sdk/client-rekognition";
import fs from 'fs'

const REGION = "eu-west-1"; 
const rekogClient = new RekognitionClient({
    region: REGION,
    'profile': 'personal'
});

const BUCKET = 'election-2022'
const MD5_TO_NAME = {}

let numberOfResuest = 0

const matchFace = async (face_id) => {
    numberOfResuest++
    console.log(face_id)
    // return
    try {
        // return
        const params = {
            CollectionId: 'kneset24',
            FaceId:face_id,
            FaceMatchThreshold:90,
            MaxFaces:30
        }
        const response = await rekogClient.send(new SearchFacesCommand(params));
        fs.writeFileSync(`images/search_faceid_result/${face_id}.json`, JSON.stringify(response, null, 2));
        console.log(response)
    } catch (err) {
        console.log("Error", err);
    }
};

// matchFace('345100d5-4871-4d0c-8e95-fa398dadd947')

const folders = fs.readdirSync('images');

for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    for (const file of files) {
        if (!file.endsWith('detection.json')) continue
        
        const jsonData = JSON.parse(fs.readFileSync(`images/${folder}/${file}`, 'utf8'));
        const numberOfFaces = jsonData.FaceRecords.length;
        if(numberOfFaces === 1) continue
        console.log(file, numberOfFaces)
        for (const face of jsonData.FaceRecords) {
            const faceID = face.Face.FaceId;
            await matchFace(faceID)
            // process.exit()
        }
        // SearchInImage(`${folder}/${file.replace('.json', '')}`);

    }
}

console.log(numberOfResuest)