import React from 'react';
import { MDBDataTable, MDBCarousel, MDBCarouselInner, MDBCarouselItem } from 'mdbreact';
import basicStatTableData from './basicStatTableData.json'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

const LABELS = ["HAPPY", "SAD", "ANGRY", "SURPRISED", "DISGUSTED", "FEAR", "CONFUSED", "CALM"]
const LABEL_TO_HEBREW = {
    "HAPPY": "שמחה", 
    "SAD": "עצבות", 
    "ANGRY": "כעס", 
    "SURPRISED": "הפתעה",
    "DISGUSTED": "גועל", 
    "FEAR": "פחד", 
    "CONFUSED": "בלבול", 
    "CALM": "רוגע",
    "name": "שם",
    "party": "מפלגה",
}
const LABEL_TO_COLOR = {
    "HAPPY": "185,70,150", 
    "SAD": "153,179,194", 
    "ANGRY": "220,61,44", 
    "SURPRISED": "179,205,70",
    "DISGUSTED": "114,80,67", 
    "FEAR": "243,180,70", 
    "CONFUSED": "73,162,215", 
    "CALM": "73,197,83"
}

const { rows, imageData, columns } = basicStatTableData
rows.forEach(row => {
    row.clickEvent = (row) => global.setData(row)
})
columns.forEach(column => {
    column.label = LABEL_TO_HEBREW[column.label]
})

const EmotionChart = ({data, showLegend, size}) => {
    if(!data) return null
    const pieData = {
        labels: LABELS.map(label => LABEL_TO_HEBREW[label]),
        datasets: [
          {
            data: LABELS.map(label => data[label]),
            backgroundColor: LABELS.map(label => `rgba(${LABEL_TO_COLOR[label]}, 0.2)`),
            borderColor: LABELS.map(label => `rgba(${LABEL_TO_COLOR[label]}, 1)`),
            borderWidth: 1,
          },
        ],
      };
    const options = {
        plugins: {
          legend: {
            display: showLegend,
          },
        },
      };
    return <div style={{width: size, height: size}}>
        <Pie data={pieData} options={options} />
    </div>
}

const sortImages = images => {
    const sortedImages = images.sort((a, b) => {
        const aVal = Number(a.url.split("_")[0].split("/")[4])
        const bVal = Number(b.url.split("_")[0].split("/")[4])
        return aVal - bVal
    })
    return sortedImages
}

const getSortedLabel = (data) => {
    const sortedLabels = LABELS.sort((a, b) => {
        const aVal = data[a]
        const bVal = data[b]
        return bVal - aVal
    })
    return sortedLabels
}

const UrlToTxt = ({url}) => {
    const val = Number(url.split("_")[0].split("/")[4]) + 1
    const source = url.split('_')[1].replace('.png', '')
    return <p style={{
        direction: 'rtl',
        textAlign: 'center',
    }}>
        <span style={{
            fontWeight: 'bold',
        }}> תוצאת חיפוש מספר: </span>
        {val}
        <br/>
        <span style={{
            fontWeight: 'bold',
        }}> מקור: </span>
        {source}
    </p>
    // return `תוצאת חיפוש מספר:${val} מקור:${source}`
}


const ImagesViewer = ({ data}) => {
    if(!data) return null
    const {name} = data
    const images = sortImages(imageData[name])
    return <MDBCarousel 
        key={name}
        style={{marginTop:32}}
        activeItem={1}
        length={images.length}
        showControls={true}
        showIndicators={true}
        className="z-depth-1">
            <MDBCarouselInner>
                {images.map((image, index) => <MDBCarouselItem itemId={index+1}>
                    <div style={{
                        width: "100%", 
                        height: "100%", 
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                        <div style={{height:32}} />
                        <div>
                            <img height={300} src={image.url} alt="First slide" />
                        </div>
                        <div style={{height:16}} />
                        {/* <p style={{
                            direction: "rtl",
                        }}>{urlToTxt(image.url)}</p> */}
                        <UrlToTxt url={image.url} />
                        <div style={{height:16}} />
                        <div style={{
                            display: "flex",
                        }}>
                            <EmotionChart data={image} showLegend={false} size={200}/>
                            <div style={{width:64}} />
                            <div>
                                {
                                    getSortedLabel(image).map(label => <p style={{
                                        color: `rgba(${LABEL_TO_COLOR[label]}, 1)`,
                                        textAlign: "right",
                                        margin: 3
                                    }}>
                                        <span style={{
                                            fontWeight: "bold",
                                        }}>{LABEL_TO_HEBREW[label]}:</span> {image[label]}
                                    </p>)
                                }
                            </div>
                        </div>
                        <div style={{height:64}} />
                    </div>
                    
                </MDBCarouselItem>)}
            </MDBCarouselInner>
    </MDBCarousel>
}

class DatatablePage extends React.Component {
    constructor(props) {
        super(props);
        let curRow = rows[Math.floor(Math.random() * rows.length)]
        console.log(window.location.hash)
        if(window.location.hash) {
            const hash = decodeURIComponent(window.location.hash).substring(1)
            console.log(hash)
            curRow = rows.find(row => row.name === hash)
        }
        this.state = {
            data: curRow,
        }
        global.setData = data => {
            window.location.hash = data.name
            this.setState({ data })
        }
    }
    render() {
        return <div className="container-fluid">
            <div className="row">
                <div className="col-sm" style={{ 
                    // backgroundColor: "rgba(255,0,0, 0.1)",
                    marginTop: 32,
                }}>
                    <h1 style={{
                        textAlign: "center",
                    }}
                    >ח״כים וחיוכים</h1>
                    <p style={{
                        textAlign: "right",
                        marginTop: 16,
                    }}>
                        אתר זה מציג ניתוח תמונות הפנים של חברי הכנסת העשרים וארבע 
                        <a href="https://aws.amazon.com/rekognition/the-facts-on-facial-recognition-with-artificial-intelligence/" target="_blank"> בעזרת כלי ניתוח פנים של אמאזון </a>
                        המורץ על תוצאות החיפוש הראשונות 
                        <a href="https://www.google.com/search?q=%D7%97%D7%91%D7%A8+%D7%9B%D7%A0%D7%A1%D7%AA&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjkueiWofT4AhX2i_0HHQMQC_oQ_AUoAXoECAEQAw&biw=1702&bih=1243&dpr=1" target="_blank"> בחיפוש התמונות של גוגל </a>
                        . 
                        לפרטים נוספים ממולץ לקרוא את הפוסט הטכני בבלוג 
                        <a href="https://route42.co.il" target="_blank"> route42 </a>
                        .
                    </p>
                    <div style={{height: 32}} />
                    <MDBDataTable
                        striped
                        bordered
                        small
                        data={basicStatTableData}
                        entriesOptions={[10, 15, 20, 25, 30, 50]}
                        entries={20}
                        noBottomColumns
                    />
                </div>
                <div className="col-sm" style={{ 
                    // backgroundColor: "rgba(0,255,0, 0.1)",
                    marginTop: 32,
                }}>
                    <h1 style={{ 
                        textAlign: "center",
                    }}>{this.state.data?.name}</h1>
                    <h3 style={{ 
                        textAlign: "center",
                        marginTop: 16
                    }}>ממוצע רגשות</h3>
                    <div style={{ 
                        display: "flex",
                        marginTop: 8,
                        justifyContent: "center",
                    }}>
                        <EmotionChart data={this.state.data} showLegend={true} size={320}/>
                    </div>
                    <ImagesViewer data={this.state.data} />
                </div>
            </div>
        </div>
    }
}

export default DatatablePage;