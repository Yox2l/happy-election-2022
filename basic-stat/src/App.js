import React from 'react';
import { MDBDataTable } from 'mdbreact';
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

const ImagesViewer = ({ data}) => {
    if(!data) return null
    const {name} = data
    const images = imageData[name]
    return <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 64
    }}>
        {images.map(image => <div key={image.url} style={{
            display: "flex",
            marginTop: 32,
            width: "100%",
        }}>
            <EmotionChart data={image} showLegend={false} size={200}/>
            <div style={{
                flex: 1
            }}/>
            <div>
                <img src={image.url} height={200} />
                <p style={{ 
                    textAlign: "center",
                }}>{image.url.split('_')[1].replace('.png', '')}</p>
            </div>
            
            <div style={{
                flex: 1
            }}/>
        </div>)}
    </div>
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
                    <MDBDataTable
                        striped
                        bordered
                        small
                        data={basicStatTableData}
                        entriesOptions={[5, 15, 25, 30, 50]}
                        entries={15}
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
                    {/* <p style={{ 
                        textAlign: "right",
                    }}>ממוצע רגשות</p> */}
                    <div style={{ 
                        display: "flex",
                        marginTop: 32,
                        justifyContent: "center",
                    }}>
                    <EmotionChart data={this.state.data} showLegend={true} size={350}/>
                    </div>
                    <ImagesViewer data={this.state.data} />
                </div>
            </div>
        </div>
    }
}

export default DatatablePage;