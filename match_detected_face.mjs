import { RekognitionClient, SearchFacesCommand } from "@aws-sdk/client-rekognition";
import fs from 'fs'

const REGION = "eu-west-1"; 
const rekogClient = new RekognitionClient({
    region: REGION,
    'profile': 'personal'
});

const BUCKET = 'election-2022'
const MD5_TO_NAME = {}

let activeDownload = 0
const MAX_ACTIVE_DOWNLOAD = 10
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const matchFace = async (face_id) => {
    try {
        // return
        const params = {
            CollectionId: 'kneset24',
            FaceId:face_id,
            FaceMatchThreshold:90,
            MaxFaces:30
        }
        const response = await rekogClient.send(new SearchFacesCommand(params));
        fs.writeFileSync('RES.json', JSON.stringify(response, null, 2));
        console.log(response)
    } catch (err) {
        console.log("Error", err);
    }
    activeDownload--
};

matchFace('345100d5-4871-4d0c-8e95-fa398dadd947')