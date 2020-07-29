import XLSX from 'xlsx'
export async function importExcel(file) {
  // let file = file.files[0] // 使用传统的input方法需要加上这一步
  const types = file.name.split(".")[1];
  const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
    item => item === types
  );
  if (!fileType) {
    alert("格式错误！请重新选择");
    return;
  }
  const tabJson = await file2Xce(file)
  return tabJson
  // const tabJson = await file2Xce(file).then(tabJson => {
  //   // if (tabJson && tabJson.length > 0) {
  //   //   // console.log(tabJson);

  //   //   res = tabJson;
  //   //   // xlsxJson就是解析出来的json数据,数据格式如下
  //   //   // [
  //   //   //   {
  //   //   //     sheetName: sheet1
  //   //   //     sheet: sheetData
  //   //   //   }
  //   //   // ]
  //   // }
  // });

}
function file2Xce(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = e.target.result;
      this.wb = XLSX.read(data, {
        type: "binary"
      });
      const result = [];
      this.wb.SheetNames.forEach(sheetName => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
        });
      });
      resolve(result);
    };
    reader.readAsBinaryString(file);
  });
}

