// run faces analyter on AWS rekognition

import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import fs from 'fs'

// Set the AWS Region.
const REGION = "eu-west-1"; //e.g. "us-east-1"
// Create SNS service object.
const rekogClient = new RekognitionClient({
    region: REGION,
    'profile': 'personal'
});

const BUCKET = 'election-2022'

let activeDownload = 0
const MAX_ACTIVE_DOWNLOAD = 10
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const detectFace = async (photoName) => {
    while (activeDownload >= MAX_ACTIVE_DOWNLOAD) {
        await sleep(1000)
    }
    activeDownload++
    console.log(`Detecting faces in ${photoName}`)
    try {
        // Set params
        const params = {
            Image: {
                S3Object: {
                    Bucket: BUCKET,
                    Name: photoName
                },
            },
            Attributes: ['ALL']
        }
        const response = await rekogClient.send(new DetectFacesCommand(params));
        fs.writeFileSync('images/' + photoName + '.json', JSON.stringify(response, null, 2));
    } catch (err) {
        console.log("Error", err);
    }
    activeDownload--
};

// detectFace();
// go over all the png file in images folder

const folders = fs.readdirSync('images');
for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    for (const file of files) {
        if (!file.endsWith('.png')) continue
        // console.log(`${folder}/${file}`);
        detectFace(`${folder}/${file}`);
    }
    // break
}