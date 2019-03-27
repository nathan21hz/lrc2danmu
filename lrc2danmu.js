//通过LRC格式批量发送弹幕
//by Nathan_21hz
//替换歌词后直接将代码复制到视频播放页Console中执行即可

//获取Cookies
function getCookie(name) {
  var cookies = document.cookie;
  var list = cookies.split("; ");          // 解析出名/值对列表
      
  for(var i = 0; i < list.length; i++) {
    var arr = list[i].split("=");          // 解析出名和值
    if(arr[0] == name)
      return decodeURIComponent(arr[1]);   // 对cookie值解码
  } 
  return "";
}

//延时
function sleep(numberMillis) {    
    var now = new Date();    
    var exitTime = now.getTime() + numberMillis;   
    while (true) { 
        now = new Date();       
        if (now.getTime() > exitTime) 
            return;
    } 
}


aid = window.location.href.match(/(?<=av)([0-9]*)/)[0]
lrc = ""    //lrc格式歌词，使用\n换行，一句一行
offset = 0  //时间偏移量（毫秒）

$.ajax({
    url : 'https://api.bilibili.com/x/web-interface/view',
    type : 'GET',
    data : {aid : aid},
    success: function(response){
        var oid = response.data.cid
        var csrf = getCookie('bili_jct')
        var rnd = new Date().getTime().toString() + "0000"

        lines = lrc.split("\n")
        for (l in lines){
            correntLine = lines[l];
            min = parseInt(correntLine.match(/[0-9]{2}(?=:)/)[0])
            sec = parseFloat(correntLine.match(/(?<=:)[0-9]{2}.[0-9]{2,3}/)[0])
            time = parseInt((min*60+sec)*1000+offset)
            text = correntLine.match(/(?<=\]).*/)[0]
        
            sleep(5000)

            var data = {type:'1',
                    oid: oid,
                    msg: text,
                    aid: aid,
                    progress: time,
                    color: '16777215',  //10进制颜色
                    fontsize: '18',     //18：小 25：中
                    pool: '0',
                    mode: '4',  //1：滚动弹幕 4：底端弹幕
                    rnd: rnd,
                    plat: '1',
                    csrf: csrf}

            $.ajax({
                url : 'https://api.bilibili.com/x/v2/dm/post',
                data : data,
                type : 'POST',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
            })
        }

    }
})