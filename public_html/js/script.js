
var xmlHttp = null;
function loadVideo(){
    //make request to database for a video list
    var Url = "/api";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = proccessVideoRequest;
    xmlHttp.open("POST",Url,true);
    xmlHttp.send("{\"action\":\"getvideo\"}");
}
function proccessVideoRequest(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var results = JSON.parse(xmlHttp.responseText);
        if(results.success == true){
            var vid = "<video id=\"randomVid\" width=\"720\"controls autoplay autobuffer>" +
                        "<source src=\"vid/";
                
            vid += results.value;
            
            vid += ".mp4\" type=\"video/mp4\">"+
                "Your browser does not support the video tag.</video>";
            
            document.getElementById("vidBox").innerHTML = vid;
            document.getElementById("randomVid").addEventListener('ended', loadVideo,false);
            document.getElementById("randomVid").addEventListener('canplay', function(){
                document.getElementById("randomVid").play();
            });
            document.getElementById("randomVid").load();
            document.getElementById("randomVid").play();
        }
        else{
            alert(results.reason);
        }
    }
    else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
        alert("Can not connect to server");
    }
    
}