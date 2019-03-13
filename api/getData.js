import {indexData} from 'data/indexData.js'
import {searchResults} from 'data/searchResults.js'
import {indexMoreData} from "data/indexMoreData.js"
import {recommendListData} from "data/recommendListData.js"
import {proDetailData} from "data/getProductDetailData.js"
//获取首页‘精选’的数据
export function getIndexData(){
    // var url="./data/index.json";
    // var data={}
    // $http(url,data).then((res)=>{
    //     console.log(res);
    // });
    return indexData;
}
//获取首页‘加载更多’的数据
export function getIndexMoreData(){
    // var url="./data/index.json";
    // var data={}
    // $http(url,data).then((res)=>{
    //     console.log(res);
    // });
    return indexMoreData;
}
//获取首页除‘精选’外其菜单的加载数据
export function getIndexCategoryCom(curIndex){
    console.log(curIndex);
    switch(curIndex){
        case 1: return indexCategoryCom1;break;
        case 2: return indexCategoryCom2;break;
        case 3: return indexCategoryCom3;break;
        case 4: return indexCategoryCom4;break;
        case 5: return indexCategoryCom5;break;
        case 6: return indexCategoryCom6;break;
    }
}
export function getCategoryData(){
    return categoryData;
}
export function getHotKeyWords(){
  return ["酒吧", "面具酒吧", "meetu", "沪吧", "G CLUB 老鬼俱乐部", "MOSSO音乐酒吧", "Friday Night Cocktail Bar","83BANDS CLUB"];
}
export function getSearchResults(){
    return searchResults.pageData.searchResults;
}
export function getRecommendListData(){
    return recommendListData;
}
export function getProductDetailData(){
    return proDetailData.pageData;
}
function $http($url,$data){
    wx.request({
        url: url, //仅为示例，并非真实的接口地址
        data: data,
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: (res) =>{
            return res;
        },
        fail:(res)=>{
            console.log(res);
        }
      })
}
