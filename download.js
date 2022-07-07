// const request = require('request');
// const cheerio = require('cheerio');
const fs = require('fs');

var puppeteer = require('puppeteer');
// const readline = require("readline-sync");

// const path = require('path');
const axios = require('axios').default;

// fileUrl: the absolute url of the image or video you want to download
// downloadFolder: the path of the downloaded file on your machine
const downloadFile = async (fileUrl,localFilePath) => {
    try {
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
          });
        const w = response.data.pipe(fs.createWriteStream(localFilePath));
        w.on('finish', () => {
            console.log('Successfully downloaded file!');
        });
    } catch (e) {
        console.error(e)
        console.log(1222222)
    }
    
}; 


const Google_Image = 'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1873&bih=990&'
// let data = 'Ramayana HD Images Good Quality wallpaper'
const data = process.argv[2]
let search_url = Google_Image + 'q=' + data;

var imagelinkslist =[];
let main = async () => {
    // return
  const browser = await puppeteer.launch({ headless: false,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width:1920,
      height:1080
    }
});
  const page = await browser.newPage();
  let result;
  await page.goto(search_url);
  console.log(search_url)

  const folder = "images/" + data
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
  // /html/body/div[2]/c-wiz/div[3]/div[1]/div/div/div/div[1]/div[1]/span/div[1]/div[1]/div[1]/a[1]/div[1]/img
  // /html/body/div[2]/c-wiz/div[3]/div[1]/div/div/div/div[1]/div[1]/span/div[1]/div[1]/div[2]/a[1]/div[1]/img
 
//   let previewimagexpath = '/html/body/div[2]/c-wiz/div[3]/div[2]/div[3]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[2]/div/a/img'
  let previewimagexpath = '/html/body/div[2]/c-wiz/div[3]/div[2]/div[3]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img'
 // previewimagexpath = '//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[2]/div/a/img'
  for(let i=1;i<35;i++)
  {
       let imagexpath = '/html/body/div[2]/c-wiz/div[3]/div[1]/div/div/div/div[1]/div[1]/span/div[1]/div[1]/div['+i+']/a[1]/div[1]/img'
       const elements = await page.$x(imagexpath)
       await elements[0].click();
       await page.waitForTimeout(2500);
       const image = await page.$x(previewimagexpath);
       console.log(image)
       let d = await image[0].getProperty('src') 
       console.log(d._remoteObject.value);
       imagelinkslist.push(d._remoteObject.value)
       const url = d._remoteObject.value
       try {
            //console.log(url);
            const path = `${folder}/image${i}.png`;
            if(url.indexOf('http') === 0) {
                downloadFile(url , path);
            } else if(url.indexOf('data') === 0) {
            fs.writeFile(path, url.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, ""), 'base64', function(err) {
                if (err) throw err;
                console.log(path + ' File created!');
            });
            } else {
                console.log('Invalid URL', url);
            }
        } catch(err) {
            console.log("Error", err);
            console.log(1234)
        }
    //    await page.waitForTimeout(300000);
  }
  await browser.close();
};

main()

// main().then(()=>{
//     console.log('Got Image links');
//     imagelinkslist.map((el,index)=>{
//         const folder = "results/" + data
//         if (!fs.existsSync(folder)) {
//             fs.mkdirSync(folder);
//         }
//         try {
//             let url = el;
//             //console.log(url);
//             const path = `${folder}/image${index+1}.png`;
//             if(url.indexOf('http') === 0) {
//               downloadFile(url , path);
//             } else if(url.indexOf('data') === 0) {
//               fs.writeFile(path, url.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, ""), 'base64', function(err) {
//                 if (err) throw err;
//                 console.log(path + ' File created!');
//               });
//             } else {
//               console.log('Invalid URL', url);
//             }
//         } catch(err) {
//             console.log("Error", err);
//             console.log(1234)
//         }

//     })
//   //  console.log(imagelinkslist)
// });
