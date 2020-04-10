/**excel导出 */
export function OutExcel(name, title, data, headTitle, dateTitle) {
  if(data.length>65000){
    let reg = new RegExp("^[0-9]*$");
    let str = headTitle +'\n';
    str += dateTitle +'\n';
    str += title.toString() +'\n';
    //增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < data.length ; i++ ){
      for(let item in data[i]){
        if((data[i][item].length>11 && reg.test(data[i][item])) || (isNaN(data[i][item])&&!isNaN(Date.parse(data[i][item])))){
          str+= data[i][item]+'\t,';
        }else{
          str+= data[i][item]+',';
        }
      }
      str+='\n';
    }
    // encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    // 对下载的文件命名
    link.download =  name+".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }else{
    // let filter = [];
    console.log(data);
    var excleTitle;
    if(headTitle){
      excleTitle = "<tr><td align='center' style='font-size:24px;height:50px;line-height:50px' colspan="+ title.length +">"+  headTitle + "</tr></td>"
    }
    if(dateTitle){
      excleTitle += "<tr><td align='center' style='font-size:20px;height:40px;line-height:40px' colspan="+ title.length +">"+  dateTitle + "</tr></td>"
    }

    var headrow = "<tr>";
    if (title) {
      for (var i in title) {
        headrow += "<th align='center'>" + title[i] + '</th>';
      }
    }
    var excel = "<table>";
    excel += excleTitle + headrow + "</tr>";
    for (var i = 0; i < data.length; i++) {
      let row = "<tr>";
      for (var index in data[i]) {
        //判断是否有过滤行
        // if (filter) {
        //   if (filter.indexOf(index) == -1) {
        //     var value = data[i][index] == null ? "" : data[i][index];
        //     row += `<td style=\"mso-number-format:'\@';\">${value}</td>`
        //   }
        // } else {
          var value = data[i][index] == null ? "" : data[i][index];
          row += `<td style=\"mso-number-format:'\@';\">${value}</td>`
        // }
      }
      excel += row + "</tr>";
    }
    excel += "</table>";
    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/html401'>";
    // excelFile += '<meta http-equiv="content-type" content="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 11]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "Sheet1";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";

    // 数据量过大使用blob对象
    var excelBlob = new Blob([excelFile], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
    var oA = document.createElement('a');
    // 利用URL.createObjectURL()方法为a元素生成blob URL
    oA.href = URL.createObjectURL(excelBlob);
    // 给文件命名
    oA.download = name;
    // // 模拟点击
    oA.click();
  }
}

// Excel导出，可导出为多个sheet表
var mainHtml_g, sheetHtml_g
export function OutExcel(name, title, data, headTitle, dateTitle){
  let sheetsName = [];
  for(let i=0; i<Math.ceil(data.length/30000);i++){
    sheetsName.push('Sheet'+(i+1))
  }
  console.log(sheetsName);
  sheetHtml_g = getSheetXml(data,title,headTitle,dateTitle,sheetsName)
  mainHtml_g = getMainXml(sheetsName)
  let XLSData = 'data:application/vnd.ms-excelbase64,' + window.btoa(window.unescape(encodeURIComponent(mainHtml_g)))
  download(XLSData,name)
}
function download (base64data,name) {
  let blob
  let a = document.createElement("a");
  if (window.URL.createObjectURL) {
    blob = base64ToBlob(base64data)
    a.href = window.URL.createObjectURL(blob)
    a.download = name+'.xls'
    a.click();
    return
  }
  a.href = base64data
  a.download = name+'.xls'
  document.getElementById('download').click()
}
// 创建文件流
function base64ToBlob (base64Data) {
  let arr = base64Data.split(',')
  let mime = arr[0].match(/:(.*?)/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8ClampedArray(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
// 获取所有xml代码
function getMainXml (sheetsName) {
  let mainHtml = ''
  let sheets = ''
  let printFormula = '' // 打印固定头部
  if (sheetsName.length > 0) {
    for (let i = 0; i < sheetsName.length; i++) {
      let name = sheetsName[i]
      let sheetItem = `
        <x:ExcelWorksheet>
        <x:Name>${name}</x:Name>
        <x:WorksheetSource HRef=3D"report/sheet${name}.xml"/>
        </x:ExcelWorksheet>`
      sheets += sheetItem
      printFormula += `
        <x:ExcelName>
        <x:Name>Print_Titles</x:Name>
        <x:SheetIndex>${i + 1}</x:SheetIndex>
        <x:Formula>=3D'${name}'!$1:$7</x:Formula>
        </x:ExcelName>
        <x:ExcelName>
        <x:Name>Print_Titles</x:Name>
        <x:SheetIndex>${i + 1}</x:SheetIndex>
        <x:Formula>=3D'${name}'!$1:7</x:Formula>
        </x:ExcelName>`
    }
  }
  mainHtml = `MIME-Version: 1.0
X-Document-Type: Workbook
Content-Type: multipart/related; boundary="----BOUNDARY_0008----"

------BOUNDARY_0008----
Content-Location: file:///C:/0E8D990C/report.xml
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="us-ascii"

<html xmlns:o=3D"urn:schemas-microsoft-com:office:office"
xmlns:x=3D"urn:schemas-microsoft-com:office:excel"
xmlns=3D"http://www.w3.org/TR/REC-html40">

<head>
<xml>
 <o:DocumentProperties>
  <o:Author>ijovo</o:Author>
  <o:LastAuthor>ijovo</o:LastAuthor>
  <o:Company>ijovo</o:Company>
  <o:Version>1.0</o:Version>
 </o:DocumentProperties>
</xml>
<!--[if gte mso 9]>
<xml>
 <x:ExcelWorkbook>
  <x:ExcelWorksheets>${sheets}
  </x:ExcelWorksheets>
 </x:ExcelWorkbook>
 ${printFormula}
</xml>
<![endif]-->
</head>
</html>` + sheetHtml_g + `------BOUNDARY_0008------`
  return mainHtml
}
// 获取每个sheet的xml代码
function getSheetXml (data,title,headTitle,dateTitle,sheetsName) {
  let excelData = [];
  if(sheetsName.length !== 1){
    for (const key in sheetsName) {
      console.log(key*30000);
      console.log((Number(key)+1)*30000);
      excelData.push(data.slice(key*30000,(Number(key)+1)*30000));
    }
  }else{
    excelData.push(data);
  }
  console.log(excelData)
  let sheetHtml = ''
  let sheets = ''
  for (let i = 0; i < excelData.length; i++) {
    let name = sheetsName[i]
    // MIME要求格式必须顶格……所以这里排版比较乱……
    let sheetItem = `

------BOUNDARY_0008----
Content-Location: file:///C:/0E8D990C/report/sheet${name}.xml
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="us-ascii"

<html 
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <xml>
      <x:WorksheetOptions>
        <x:ProtectContents>False</x:ProtectContents>
        <x:ProtectObjects>False</x:ProtectObjects>
        <x:ProtectScenarios>False</x:ProtectScenarios>
      </x:WorksheetOptions>
    </xml>
    <style>
      <!-- @page
        {mso-footer-data:"&C\\7B2C &P \\9875\\FF0C\\5171 &N \\9875";
        margin:0.748in 0.195in 0.748in 0.195in;
        mso-header-margin:0.51in;
        mso-footer-margin:0.51in;}
      -->
    </style>
  </head>
  <body>`

    let excleTitle;
    if(headTitle){
      excleTitle = `
      <tr>
        <td align='center' style='font-size:24px;height:50px;line-height:50px' colspan="${title.length}">${headTitle}</td>
      </tr>`
    }
    if(dateTitle){
      excleTitle += `
      <tr>
        <td align='center' style='font-size:20px;height:40px;line-height:40px' colspan="${title.length}">${dateTitle}</td>
      </tr>`
    }

    var headrow = `
      <tr>`;
    if (title) {
      for (let i in title) {
        headrow += `
        <th align='center'>${title[i]}</th>`;
      }
    }
    
    let excel = `
    <table>`;
    excel += excleTitle + headrow + `
      </tr>`;
    for (let j = 0; j < excelData[i].length; j++) {
      let row = `
      <tr>`;
      for (var index in excelData[i][j]) {
        //判断是否有过滤行
        // if (filter) {
        //   if (filter.indexOf(index) == -1) {
        //     var value = data[i][index] == null ? "" : data[i][index];
        //     row += `<td style=\"mso-number-format:'\@';\">${value}</td>`
        //   }
        // } else {
        var value = excelData[i][j][index] == null ? "" : excelData[i][j][index];
        row += `
        <td style=\"mso-number-format:'\@';\">${value}</td>`
        // }
      }
      excel += row + `
      </tr>`;
    }
    excel += `
    </table>`;

    sheetItem += excel + `
  </body>
</html>`
    sheets += sheetItem
  }
  sheetHtml = sheets
  // console.log(sheetHtml);
  return sheetHtml
}
