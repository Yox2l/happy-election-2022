const fs = require('fs');
const puppeteer = require('puppeteer');
const axios = require('axios').default;

const MAX_IMAGE_TO_DOWNLOAD = 30
const downloadFile = async (fileUrl, localFilePath) => {
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
    } catch (e) { }
};


var imagelinkslist = [];
let main = async () => {
    const name =  process.argv[2]
    const search_url = 'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1873&bih=990&' + 'q=' + name;
    console.log(`Running google image search on: ${search_url}`);
    // return
    const browser = await puppeteer.launch({
        // headless: false,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const page = await browser.newPage();
    await page.goto(search_url);
    const folder = "images/" + name
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    const previewimagexpath   = '/html/body/div[2]/c-wiz/div[3]/div[2]/div[3]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img'
    let image_index = 0;
    for (let i = 1; i < 100; i++) {
        console.log(i)
        let imagexpath = '/html/body/div[2]/c-wiz/div[3]/div[1]/div/div/div/div[1]/div[1]/span/div[1]/div[1]/div[' + i + ']/a[1]/div[1]/img'
        const elements = await page.$x(imagexpath)
        if (elements.length === 0) continue
        
        console.log(elements)
        await elements[0].click();
        await page.waitForTimeout(1500);
        const image = await page.$x(previewimagexpath);
        // const image_source_path = '/html/body/div[2]/c-wiz/div[3]/div[2]/div[3]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[3]/div[1]/a[1]/div/div/span'
        const image_source_path = '/html/body/div[2]/c-wiz/div[3]/div[2]/div[3]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[3]/div[1]/a[1]/div/div'
        // get image_source_path span text

        const spanElement = await page.$x(image_source_path);
        console.log(spanElement)
        const image_source_path_text = await (await spanElement[0].getProperty('textContent')).jsonValue();
        console.log(image_source_path_text)
        // spanElement = spanElement.pop();
        // spanElement = await spanElement.getProperty('innerText');
        // spanElement = await spanElement.jsonValue();

        // const image_source_path_text = await page.evaluate(image_source_path => {
        //     return document.querySelector(image_source_path).innerText;
        // }, image_source_path);
        console.log(image_source_path_text)
        const image_source = await page.$x(image_source_path);
        let d = await image[0].getProperty('src')
        console.log(d._remoteObject.value);
        imagelinkslist.push(d._remoteObject.value)
        const url = d._remoteObject.value
        try {
            const path = `${folder}/${image_index}_${image_source_path_text}.png`;
            if (url.indexOf('http') === 0) {
                await downloadFile(url, path);
                image_index++;
            } else if (url.indexOf('data') === 0) {
                const image_data = url.replace(/^data:image\/png;base64,/, '').replace.replace(/^data:image\/jpeg;base64,/, '')
                fs.writeFileSync(path, Buffer.from(image_data), 'base64');
                image_index++;
            } else {
                console.log('Invalid URL', url);
            }
            if (image_index >= MAX_IMAGE_TO_DOWNLOAD) {
                break;
            }
        } catch (err) {}
    }
    await browser.close();
};

main()
