import fs from 'fs'

const faceDict = JSON.parse(fs.readFileSync('face_dict.json', 'utf8'));

const folders = fs.readdirSync('images/search_faceid_result');

const DATA = {} 

for (const file of folders) {
    // console.log(file);
    const jsonData = JSON.parse(fs.readFileSync(`images/search_faceid_result/${file}`, 'utf8'));
    const detected = {}
    for (const face of jsonData.FaceMatches) {
        const faceID = face.Face.FaceId;
        // console.log(faceID);
        const user = faceDict[faceID];
        if (user) {
            // console.log(user);
            if(user in detected) {
                detected[user] += 1
            } else {
                detected[user] = 1
            }
        }
    }
    // find the most common user
    let max = 0;
    let user = '';
    for (const key in detected) {
        if (detected[key] > max) {
            max = detected[key];
            user = key;
        }
    }
    if(user){
        DATA[file.replace('.json', '')] = user;
    }
    console.log(`${file} ${user}`);
}

fs.writeFileSync(`multi_image_face_id_to_user.json`, JSON.stringify(DATA, null, 2));