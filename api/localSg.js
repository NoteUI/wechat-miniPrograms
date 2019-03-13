const KEY="goodsData";
//实现数据添加
export function setItem(value){
    var jsonString=wx.getStorage(KEY);
    jsonString=jsonString||'[]';
    var arr=JSON.parse(jsonString);
    arr.push(value);
    wx.setStorage(KEY,JSON.stringify(arr));
}
//获取数据
export function getItem(){
    var jsonString=wx.getStorage(KEY);
    jsonString=jsonString||'[]';
    return JSON.parse(jsonString);
}
//更新数据
export function updataGoodsData(){

}
//将数据合成一个对象形式，{goodsId:goodsNum}
export function getGoodsObj(){
    
}