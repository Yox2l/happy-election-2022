import { RekognitionClient, IndexFacesCommand } from "@aws-sdk/client-rekognition";
import fs from 'fs'
import crypto from 'crypto'

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

const detectFace = async (photoName) => {
    console.log(photoName)
    // return
    while (activeDownload >= MAX_ACTIVE_DOWNLOAD) {
        await sleep(1000)
    }
    activeDownload++
    console.log(`Detecting faces in ${photoName}`)
    try {
        // Set params
        const md5_name = crypto.createHash('md5').update(photoName).digest('hex')
        console.log(md5_name)
        MD5_TO_NAME[md5_name] = photoName
        // return
        const params = {
            CollectionId: 'kneset24',
            Image: {
                S3Object: {
                    Bucket: BUCKET,
                    Name: photoName
                },
            },
            ExternalImageId:md5_name,
            MaxFaces:10,
            QualityFilter:"AUTO",
            DetectionAttributes:['ALL']
            // Attributes: ['ALL']
        }
        const response = await rekogClient.send(new IndexFacesCommand(params));
        fs.writeFileSync('images/' + photoName + '_detection.json', JSON.stringify(response, null, 2));
        console.log(response)
    } catch (err) {
        console.log("Error", err);
    }
    activeDownload--
};


const folders = fs.readdirSync('images');
for (const folder of folders) {
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    for (const file of files) {
        if (!file.endsWith('.png')) continue
        detectFace(`${folder}/${file}`);
        // break
    }
    // break;
}
// console.log(MD5_TO_NAME)
// fs.writeFileSync('images/MD5_TO_NAME.json', JSON.stringify(MD5_TO_NAME, null, 2));