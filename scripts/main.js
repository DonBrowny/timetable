const descAttr = { class : "description"}
const headerAttr = { class : "tableHeader"}
const rowAttr = { class : "tableRow"}
const startCellAttr = { class : "startCell"}

function createTable(content) {
  return `<ol>${content}</ol>`;
}

function createRow(content, attrObj = undefined) {
  return `<li ${convertObjToStr(attrObj)}>${content}</li>`;
}

function createCell(content, attrObj = undefined) {
  let value = content || "";
  return `<div ${convertObjToStr(attrObj)}>${value}</div>`;
}

function convertObjToStr(attrObj){
  if(attrObj){
    return Object.keys(attrObj).reduce((acc, key)=> {
      return acc + ` ${key}="${attrObj[key]}"`;
    },"")
  } else {
    return "";
  }
}

function addTime(strTime, value){
  const [hr, min] = strTime.split(":");
  return `${parseInt(hr)+value}:${min}`;
}

function convertToMin(strTime) {
  const [hr, min] = strTime.split(":");
  return hr * 60 + parseInt(min);
}

class TimeTable {
  constructor(id, options) {
    this.id = id;
    this.setDefaults(options);
  }

  setDefaults(options) {
    const {
      descColumn,
      descColumnName,
      startTime,
      endTime,
      interval,
    } = options;
    this.descColumn = descColumn;
    this.descColumnName = descColumnName || "Days";
    this.startTime = startTime;
    this.endTime = endTime;
    this.startMin = convertToMin(startTime);
    this.endMin = convertToMin(endTime);
    this.intervalMin = interval;
    this.interval = 60 / interval;
    this.setHeaderClmCount = (this.endMin - this.startMin) / 60 ;

    //set css variables
    var r = document.querySelector(':root');
    console.log(this.setHeaderClmCount )
    r.style.setProperty('--headerClmCount', this.setHeaderClmCount );
    r.style.setProperty('--rowClmCount', this.setHeaderClmCount * this.interval);
  }

  createTable() {
    let parent = document.getElementById(this.id);
    parent.innerHTML = createTable(this.createHeader() + this.createTableContent());
  }

  createHeader(){
    let cells = createCell(this.descColumnName, descAttr);
    [...Array(this.setHeaderClmCount)].forEach((undefined, index) => {
      cells += createCell(addTime(this.startTime, index));
    })
    return createRow(cells, headerAttr)
  }

  createTableRow(descName, id){
    let cells = createCell(descName, descAttr);
    [...Array(this.setHeaderClmCount * this.interval)].forEach((undefined, index) => {
      let cellId = convertToMin(this.startTime) + this.intervalMin * index;
      let rowID = id;
      let options = index % this.interval === 0 ? Object.assign(startCellAttr, {cellId, rowID}) : {cellId, rowID};
      cells += createCell(undefined, options);
    })
    return createRow(cells, rowAttr);
  }

  createTableContent(){
    return this.descColumn.reduce((acc, cur, index) => {
      return acc + this.createTableRow(cur,index);
    }, "")
  }
}
