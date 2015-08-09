
var xmlHttp = null;
function getAllVideos(){
    //make request to database for a video list=
    var Url = "/api";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = proccessVideoRequest;
    xmlHttp.open("POST",Url,true);
    xmlHttp.send("{\"action\":\"getAllVideos\"}");
}
function proccessVideoRequest(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var results = JSON.parse(xmlHttp.responseText);
        var a = "";
        if(results.success == true){
            
            for(var i = 0; i < results.videos.length; i++){
                a += "<a  target=\"_blank\" href=\"" + results.videos[i].source;
                a += "> <div class=\"item\" id=\"item\"><div id=\"itemText\">"
                a += results.videos[i].video;
                a += "</div></div></a>";
            }
            document.getElementById("body").innerHTML += a;
        }
        else{
            alert(results.reason);
        }
    }
    else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
        alert("Can not connect to server");
    }
}