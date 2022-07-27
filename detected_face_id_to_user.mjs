import fs from 'fs'

const multi_image_face_id_to_user = JSON.parse(fs.readFileSync('multi_image_face_id_to_user.json', 'utf8'));

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
        const userInImage = []
        for (const face of jsonData.FaceRecords) {
            const faceID = face.Face.FaceId;
            const user = multi_image_face_id_to_user[faceID];
            if (user) {
                userInImage.push(user);
            }
        }
        if(userInImage.length > 1) {
            console.log(folder, file, userInImage)
        }
    }
}