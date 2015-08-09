
var xmlHttp = null;
var modUserName = "";
var modChannel = "";
var reasons = [];
var getMsgVar;
navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/);
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();
function loadBanDiv(channel,name, last_msg){
    var father = document.getElementById("choiceBox");
    var son = document.createElement("div");
    //var sonText = document.createTextNode();

    var nameDiv = document.createElement("div");
    var otherDiv = document.createElement("div");
    var optListDiv = document.createElement("div");
    last_msg = decodeURIComponent(last_msg);
    if(last_msg.length < 50)
        nameDiv.title = "last msg:: " + last_msg;
    else
        nameDiv.title = "last msg:: " + last_msg.substring(0,46) + "...";
    son.className="item";
    son.id = name;
    nameDiv.className = "itemUserName";
    otherDiv.className = "itemOtherOpt";
    optListDiv.className = "itemListOption";
    
    nameDiv.innerHTML = name;
    otherDiv.innerHTML += "<input type=\"text\" class=\"opInput\" onKeydown=chooseOpWIn(this,'"+ name + "') placeholder=\"Other Reason\">";
    for(var i = 0; i < reasons.length; i++){
        var optionButton = document.createElement("a");
        var option = document.createElement("div");
        var optionText = document.createElement("div");
        
        optionText.innerHTML = reasons[i];
        optionText.className = "text";
        optionButton.className = "itemOption";
        
        optionButton.href = "javascript:chooseOption('" + name + "','" + encodeURIComponent(optionText.innerHTML) + "')";
        option.appendChild(optionText);
        optionButton.appendChild(optionText);
        optListDiv.appendChild(optionButton);
    }
    son.appendChild(nameDiv);
    son.appendChild(otherDiv);
    son.appendChild(optListDiv);
    
    var val = father.scrollHeight - father.clientHeight <= father.scrollTop + 1;
    father.appendChild(son);
    if(val)
        father.scrollTop = father.scrollHeight - father.clientHeight;
}
function loadMessageDiv(channel, name, msg){
    
    var father = document.getElementById("twitchChat");
    
    var twMsgDiv = document.createElement("div");
    var usrDiv = document.createElement("div");
    var msgDiv = document.createElement("div");

    twMsgDiv.className="twMsg";

    usrDiv.className= "twUsr";
    msgDiv.className= "twMsg";

    usrDiv.innerHTML += name;
    msgDiv.innerHTML += msg;

    twMsgDiv.appendChild(usrDiv);
    twMsgDiv.appendChild(msgDiv);

    var val = father.scrollHeight - father.clientHeight <= father.scrollTop + 1;
    father.appendChild(twMsgDiv);
    if(val)
        father.scrollTop = father.scrollHeight - father.clientHeight;
}
function getMessages(){
    //enhanced/getmsgforuser
    var Url = "/api";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = loadMessagesToDiv;
    xmlHttp.open("POST",Url,true);
    xmlHttp.send("{\"action\":\"enhanced/getmsgforuser\""+
        ",\"user\":\"" + modUserName + "\"}");
}
function getmsgs(){
    getMsgVar = setInterval(function(){
        getMessages()
    },500);
}
function loadMessagesToDiv(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var results = JSON.parse(xmlHttp.responseText);
        var a = "";
        if(results.success == true){
            for(var i = 0; i < results.actions.length; i++){
                switch(results.actions[i].action){
                    case 'ban':
                        if(document.getElementById("choiceBox").innerHTML.indexOf(results.actions[i].user) < 0)
                            loadBanDiv(results.actions[i].channel, 
                                results.actions[i].user, results.actions[i].last_msg);
                        break;
                    case 'msg':
                        //update
                        loadMessageDiv(results.actions[i].channel, 
                            results.actions[i].user, decodeURIComponent(results.actions[i].msg));
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            //this alert is overbearing. maybe a less intrusive popup or a chat msg
            //alert(results.reason);
        }
    }
    else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
        window.clearInterval(getMsgVar);
        alert("Could not connect to server. Please refresh");
    }
    
}
function onldFunct(){
    if(navigator.sayswho.indexOf('fox') > -1 || navigator.sayswho.indexOf('ie') > -1 ){
        alert("For best look use chrome");
    }
    getReasons();
    getmsgs();
}
function chooseOpWIn(input, name){
    if(event.keyCode == 13){
        if(input.value.length > 0){
            chooseOption(name, input.value);
        }
    }
        return true;
}
function chooseOption(name, optionName){
    
    var Url = "/api";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = removeBan;
    xmlHttp.open("POST",Url,true);
    xmlHttp.send("{\"action\":\"enhanced/saveoption\""+
        ",\"user\":\"" + name + "\",\"option\":\"" + optionName +
        "\", \"modName\":\"" + modUserName + "\", \"channel\":\"" + modChannel + "\"}");
}
function removeBan(name){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var results = JSON.parse(xmlHttp.responseText);
        if(results.success == true){
            var option = document.getElementById(results.name);
            option.parentNode.removeChild(option);
        }
        else{
            alert(results.reason);
        }
    }
    else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
        alert("could not connect to server");
    }
}
function getReasons(){
    var Url = "/api";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var results = JSON.parse(xmlHttp.responseText);
            if(results.success == true){
                for(var i = 0; i < results.reasons.length; i++){
                    reasons.push(results.reasons[i].reason);
                }
            }
            else{
                alert(results.reason);
            }
        }
        else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
            alert("could not connect to server");
        }
    };
    xmlHttp.open("POST",Url,true);
    xmlHttp.send("{\"action\":\"enhanced/getreasons\""+
        ",\"channel\":\"" + modChannel + "\"}");
    
}
function prejoinChannel(){
    if(event.keyCode == 13){
        if(document.getElementById("modInputName").value.length > 0 && document.getElementById("modInputChannel").value.length > 0){
            modUserName = document.getElementById("modInputName").value;
            modChannel = document.getElementById("modInputChannel").value;
            joinChannel();
        }
    }
        return true;
}
function joinChannel(){
    if(modUserName.length < 1 || modChannel.lenght < 1)
        return;
    var Url = "/api";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var results = JSON.parse(xmlHttp.responseText);
            if(results.success == true){
                document.getElementById("channelName").innerHTML = "";
                onldFunct();
            }
            else{
                alert(results.reason);
            }
        }
        else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
            alert("could not connect to server");
        }
    };
    xmlHttp.open("POST",Url,true);
    xmlHttp.send("{\"action\":\"enhanced/joinchannel\""+
        ",\"channel\":\"" + modChannel + "\", \"user\":\"" + modUserName + "\"}");
    
}