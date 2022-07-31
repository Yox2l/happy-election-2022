import fs from 'fs'

const multi_image_face_id_to_user = JSON.parse(fs.readFileSync('multi_image_face_id_to_user.json', 'utf8'));
const nameToParty = JSON.parse(fs.readFileSync('nameToParty.json', 'utf8'));
// assign each party an id
const partyToId = {};
for (const party of Object.values(nameToParty)) {
    partyToId[party] = Object.values(partyToId).length;
}
// console.log(partyToId)
// process.exit()

const folders = fs.readdirSync('images');

const allUsers = new Set()
const allLinks = {}

for (const folder of folders) {
    // check if it is a folder
    if (!fs.lstatSync(`images/${folder}`).isDirectory()) continue
    const files = fs.readdirSync(`images/${folder}`);
    for (const file of files) {
        if (!file.endsWith('detection.json')) continue
        const jsonData = JSON.parse(fs.readFileSync(`images/${folder}/${file}`, 'utf8'));
        const numberOfFaces = jsonData.FaceRecords.length;
        if(numberOfFaces === 1) continue
        const userInImage = new Set();
        for (const face of jsonData.FaceRecords) {
            const faceID = face.Face.FaceId;
            const user = multi_image_face_id_to_user[faceID];
            if (user) {
                // userInImage.push(user);
                userInImage.add(user);
            }
        }
        if(userInImage.size > 1) {
            // console.log(folder, file, userInImage)
            for (const user of userInImage) {
                allUsers.add(user)
                for (const user2 of userInImage) {
                    if (user === user2) continue
                    const sorted_users = [user, user2].sort()
                    const sorted_users_string = sorted_users.join('|')
                    if(allLinks[sorted_users_string]) {
                        allLinks[sorted_users_string]++
                    } else {
                        allLinks[sorted_users_string] = 1
                    }
                }
            }
        }
    }
}
// console.log(allUsers)
// { id: 1, label: "Node: 1\nGroup: 1", group: 1 },

const activeUsers = new Set()
for (const link in allLinks) {
    const users = link.split('|')
    if(allLinks[link] > 3) {
        activeUsers.add(users[0])
        activeUsers.add(users[1])
    }
}

const nodes = []
const userToId = {}
for (const user of activeUsers) {
    // console.log(user)
    userToId[user] = nodes.length
    nodes.push({
        id: nodes.length,
        label: user,
        group: nameToParty[user] ? partyToId[nameToParty[user]] : 0
    })
}
const links = []
for (const link in allLinks) {
    // { from: 1, to: 2 },
    const users = link.split('|')
    if(allLinks[link] > 3) {
        links.push({
            // source: users[0],
            // target: users[1],
            // value: allLinks[link]/2
            from: userToId[users[0]],
            to: userToId[users[1]],
        })
    }
}
// console.log(nodes)
// console.log(links)
fs.writeFileSync('kneset-image-conection-graph/v2/data.json', JSON.stringify({
    nodes: nodes.sort((a, b) => a.group - b.group),
    links: links.sort((a, b) => b.value - a.value)
}, null, 2));