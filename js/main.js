//global declarations
var _chessPiece = [
    [3,2,1,2,6,4,5,4,6,1,2,2],
    [2,1,3,6,7,7,3,4,4,3,3,6],
    [2,3,5,2,7,7,3,2,1,4,4,3],
    [5,6,1,2,2,4,7,7,4,5,6,6],
    [2,6,4,4,6,1,7,7,6,2,5,5],
    [4,5,1,5,1,4,5,2,1,3,1,4],
]
var music_bg = document.getElementById("mainBg");
var music_ready = document.getElementById("ready");
var music_coin = document.getElementById("coin");
var _chessBlocks = [[],[],[],[],[],[]];
var _chessBoard = document.getElementById("chess");
var _chessSize  = [];
var _chessNum = _chessNum_2 = null;
var _chessCol1,_chessRow1,_chessCol2,_chessRow2,tx,ty;
var moveState = null;
var boomNum   = 3;
var boomTime  = 0;
var boomIndex = 0;
var clearTime = 3;
var moveTime = 0;
var isBoom  = false;
var _boomIndex;
var error;
var classNum;
var fitstFor = false;
var result = false;
var dropState =false; //true 为水平  false为垂直
var stopIt;
var getTimeOver;
var upTimeNum = 30;
var iLen_num  = 0;
//screen ready


//document ready
$(document).ready(function () {
    var img_arr_s = [
        "images/boom.png",
        "images/c1.png",
        "images/c2.png",
        "images/c3.png",
        "images/c4.png",
        "images/c5.png",
        "images/c6.png",
        "images/c7.png",
        "images/chessBg.png",
        "images/close.png",
        "images/cloud1.png",
        "images/cloud2.png",
        "images/effect1.png",
        "images/effect2.png",
        "images/logo.png",
        "images/mainBg.png",
        "images/o1.png",
        "images/o2.png",
        "images/o3.png",
        "images/ok_button.png",
        "images/ok_img.png",
        "images/ok_txt1.png",
        "images/ok_txt2.png",
        "images/s1.png",
        "images/s2.png",
        "images/s3.png",
        "images/s4.png",
        "images/scene_img1.png",
        "images/scene_img2.png",
        "images/scene_img3.png",
        "images/scene_img4.png",
        "images/scene_txt.png",
        "images/sceneBg.png",
        "images/stratTxt1.png",
        "images/stratTxt2.png",
    ];
    var iLen = img_arr_s.length;
    for (var i = 0; i < iLen; i++) {
        loadImage(img_arr_s[i],iLen);
    }
});
//onload Img
function loadImage(url,len) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        iLen_num++;
        if (iLen_num >= len) {
            init();
        }
    };
};
//dom ready
function init(){
    startAnimation();
}
//start game scene ready
function startAnimation(){
    $(".rightbox").removeClass("opacHide");
    //生成棋子
    var inum = 0;
    for(var i=0;i<6;i++){
        for(y=0;y<12;y++){
            var chessDiv = window.document.createElement("div");
            if(y == 12){
                chessDiv.className  = "chessMan  chessPiece_"+_chessPiece[i][y] + " chessMan" +inum;
            }
            if(_chessPiece[i][y] < 7){
                chessDiv.className  = "chessMan chessPiece_"+_chessPiece[i][y] + " chessMan" +inum;
            }else{
                chessDiv.className  = "chessMan chessMan"+inum;
            }
            inum ++;
            classNum = i*12+y;
            _chessBoard.appendChild(chessDiv);
            _chessSize.y = $(".chessMan"+classNum).height();
            _chessSize.x = $(".chessMan"+classNum).width();
            _chessSize.pery = _chessSize.y /$(".chess").height()*100;
            _chessSize.perx = _chessSize.x /$(".chess").width()*100;
            chessDiv.style.top =  i *_chessSize.pery+ "%";
            chessDiv.style.left=  y *_chessSize.perx+ "%";
        }
    }
    $(".cloud1").animate({
        left:"+=35%",
        opacity:1,
    });
    $(".cloud2").animate({
        right:"+=25%",
        opacity:1,
    });
    setTimeout(function(){
        $(".stratTxt2").addClass("stratTxt_1");
        $(".stratTxt1").addClass("stratTxt_2");
    },250);
}
//startGame
$(".chess").on("touchstart",function(event){
    event.preventDefault();
    $(".hand").hide();
    //列 y
    error = ($(window).width() - $("#chess").width())/2;
    _chessSize.y = $(".chessMan").eq(0).height();
    _chessSize.x = $(".chessMan").eq(0).width();
    _chessSize.pery = _chessSize.y /$(".chess").height()*100;
    _chessSize.perx = _chessSize.x /$(".chess").width()*100;
    moveState = null;
    _chessCol1 = parseInt((event.originalEvent.targetTouches[0].pageX - error) / _chessSize.x);        //行 x
    _chessRow1 = parseInt((event.originalEvent.targetTouches[0].pageY - $(window).height()*0.33) / _chessSize.y);
    _chessNum = parseInt(_chessRow1 * 12 + _chessCol1);

    this.addEventListener("touchmove",mainRaleAnimate,false);
    this.addEventListener("touchend",mainRaleEnd,false);
});
//judge direction
function mainRaleAnimate(event){
    _chessCol2 = parseInt((event.touches[0].pageX - error) / _chessSize.x);
    _chessRow2 = parseInt((event.touches[0].pageY - $(window).height()*0.33) / _chessSize.y);
    _chessNum_2 = _chessRow2 * 12 + _chessCol2;
    
    if(_chessCol2 != _chessCol1){
        //横移动
        //命令元素交换位置
        if(_chessCol2 > _chessCol1){
            moveState = "toright";
            chessMoveHor(true,_chessNum,_chessNum_2);
        }else{
            moveState = "toleft";
            chessMoveHor(false,_chessNum,_chessNum_2);
        }
        //删除自己的监听，防止再次触发
        this.removeEventListener("touchmove",mainRaleAnimate,false);
    }
    if(_chessRow2 != _chessRow1){
        //竖移动
        if(_chessRow2 > _chessRow1){
            moveState = "tobottom";
            chessMoveVer(true,_chessNum,_chessNum_2);
        }else{
            moveState = "totop";
            chessMoveVer(false,_chessNum,_chessNum_2);
        }
        this.removeEventListener("touchmove",mainRaleAnimate,false);
    }
}
//reset Chessboard
function resetChess(){
    var chessPieceNum;
    for(var x=0;x<6;x++){
        for(var y=0;y<12;y++){
            chessPiece = x*12+y
            chessPieceNum = $(".chessMan"+chessPiece).attr('class');
            chessPieceNum = chessPieceNum.substring(20,21);
            _chessBlocks[x][y] = chessPieceNum;
            _chessPiece[x][y] = chessPieceNum;
        }
    }
}
//touch game end
function mainRaleEnd(){
    var x1,x2,y1,y2;
    moveTime = 1;
    if(boomNum <3){
        resetChess();
    }else{
        console.log(123456)
        for(var x=0;x<6;x++){
            for(var y=0;y<12;y++){
                if(x == _chessRow1 && y == _chessCol1){
                    _chessBlocks[x][y] = _chessPiece[_chessRow2][_chessCol2];
                    x1 = x;
                    y1=y;
                }else if(x == _chessRow2 && y == _chessCol2){
                    _chessBlocks[x][y] = _chessPiece[_chessRow1][_chessCol1];
                    x2 = x;
                    y2=y;
                }else{
                    _chessBlocks[x][y] = _chessPiece[x][y];
                }
            }
        }
    }
    checkBoom();
    _chessCol1 = _chessRow1 = _chessCol2 = _chessRow2 = null;
}
//chess move to hor
function chessMoveHor(a,b,c){
    var a2=null;
    if(a){
        a = "+=";
        a2= "-=";
    }else{
        a = "-=";
        a2= "+=";
    }
    $(".chessMan"+b).animate({
        left:a+_chessSize.perx+"%",
    });
    $(".chessMan"+b).removeClass("chessMan"+b).addClass("chessMan"+c+211);
    $(".chessMan"+c).animate({
        left:a2+_chessSize.perx+"%",
    });
    $(".chessMan"+c).removeClass("chessMan"+c).addClass("chessMan"+b);
    $(".chessMan"+c+211).removeClass("chessMan"+c+211).addClass("chessMan"+c);
}
//chess move to ver
function chessMoveVer(a,b,c){
    var a2=null;
    if(a){
        a = "+=";
        a2= "-=";
    }else{
        a = "-=";
        a2= "+=";
    }

    $(".chessMan"+b).animate({
        top:a+_chessSize.pery+"%",
    });
    $(".chessMan"+b).removeClass("chessMan"+b).addClass("chessMan"+c+211);
    $(".chessMan"+c).animate({
        top:a2+_chessSize.pery+"%",
    });
    $(".chessMan"+c).removeClass("chessMan"+c).addClass("chessMan"+b);
    $(".chessMan"+c+211).removeClass("chessMan"+c+211).addClass("chessMan"+c);
}
//check chess has boom area
function checkBoom(){
    result = false;
    isBoom = false;
    //按行、列，分别遍历一遍
    for(var r = 0 ; r < 6 ; r++){
        var i = 0;
        var j = 1;
        
        while(i < 12){
            if(_chessBlocks[r][i] == _chessBlocks[r][j]){
                j++;
            }else{
                //把i和j之前的位，推入结果数组
                if(j - i >= 3){
                    console.log("水平");
                    result = true;
                    dropState = true;
                    boomNum --;
                    boomIndex = j-i;
                    _boomIndex = boomIndex;
                    moveTime = 0;
                    for(var m = i ; m < j ; m++){
                        boom(r,m);
                    }
                    setTimeout(function(){
                        dropDown(_boomIndex);
                    },1000);
                }
                i = j ;
                j++;
            }
        }
    }

    for(var c = 0 ; c < 12 ; c++){
        var i = 0;
        var j = 1;
        while(i < 6){
            if(j < 6 && _chessBlocks[i][c] == _chessBlocks[j][c]){
                j++;
            }else{
                //把i和j之前的位，推入结果数组
                if(j - i >= 3){
                    result = true;
                    dropState = false;
                    boomNum --;
                    boomIndex = j-i;
                    _boomIndex = boomIndex;
                    moveTime = 0;
                    for(var m = i ; m < j ; m++){
                        boom(m,c);
                    }
                    
                    setTimeout(function(){
                        dropDown(_boomIndex);
                    },1000);
                }
                i = j ;
                j++;
            }
        }
    }
    if(!isBoom){
        _chessBlocks = [[],[],[],[],[],[]];
    }
    if(!result && moveTime == 1){
        console.log("互换回去",moveTime)
        //_chessBlocks = [[],[],[],[],[],[]];
        if(moveState == "toleft"){chessMoveHor(false,_chessNum,_chessNum_2);}
        if(moveState == "toright"){chessMoveHor(false,_chessNum_2,_chessNum);}
        if(moveState == "totop"){chessMoveVer(false,_chessNum,_chessNum_2);}
        if(moveState == "tobottom"){chessMoveVer(false,_chessNum_2,_chessNum);}
    }
    if(boomNum == 0){
        setTimeout(function(){
            gameOver();
        },500)
    }
    return result;
}
//take boom and clear boom chess
function boom(a,b){
    isBoom = true;
    boomIndex --;
    _chessBlocks[a][b] = "X";
    //_chessPiece = _chessBlocks;
    var chessIndex = a*12 + b;
    setTimeout(function(){
        var topHeight = "-" + (boomIndex+1) * _chessSize.pery;
        $(".chessMan"+chessIndex).addClass("boom");
        music_coin.play();
        setTimeout(function(){
            $(".chessMan"+chessIndex).hide();
            $(".chessMan"+chessIndex).animate({
                top:topHeight+"%",
            },10);
            $(".chessMan"+chessIndex).show();
            if(boomNum<0){
                $(".scene_mark").attr("src","images/s1.png");
            }else{
                $(".scene_mark").attr("src","images/s"+(boomNum+1)+".png");
            }
            takeNew(chessIndex,a,b);
        },400)
    },400);
}
//take new chess to fill the boom area
function takeNew(mors,a,b){
    var _randomNew = Math.floor(Math.random()*6+1);
    var _a = $(".chessMan"+mors).attr('class');
        _a = _a.substring(9,21);
    
    _chessPiece[a][b] = _randomNew;
    $(".chessMan"+mors).removeClass(_a).removeClass("boom");
    $(".chessMan"+mors).addClass("chessPiece_"+_randomNew).addClass("chessMan"+mors);
}
//form out chessboard area drop new chess to boom area
function dropDown(index){
    for(var y=0;y<12;y++){
        for(var x=0;x<6;x++){
            if(_chessBlocks[x][y] == "X"){
                if(fitstFor == false){
                    fitstFor = true;
                    if(!dropState){
                        clearVer(x,y,index);
                        _chessBlocks[x][y] =  _chessPiece[x][y];
                    }else{
                        clearHir(x,y,index);
                        _chessBlocks[x][y] =  _chessPiece[x][y];
                    }
                }else{
                    _chessBlocks[x][y] =  _chessPiece[x][y];
                }
            }
        }
    }
    resetChess();
    setTimeout(function(){
        fitstFor = false;
        checkBoom();
    },200);
}
//resetting chess index for ner
function clearVer(a,b,c){
    var levTop = 6 - a;
    if(levTop == 6){
        for(var i=0;i<c;i++){
            var topHeight_1 =  (i+1) * _chessSize.pery;
            var dropChess_1 = (a+i) * 12 +b;
            $(".chessMan"+dropChess_1).animate({
                top:"+=" + topHeight_1+"%",
            },500);
            clearDown(dropChess_1,b,c,i);

        }
    }else if(levTop <= 5) {
        var leftopIndex = 6 -levTop;
            c = c + leftopIndex;
        for(var i=0;i<c;i++){
            var dropChess_1 = i * 12 +b;
            if(c-i>3){
                var topHeight_2 = 3 * _chessSize.pery;
            }else{
                if(c == 4){
                    var topHeight_2 = i * _chessSize.pery;
                }
                if(c == 5){
                    var topHeight_2 = (i-1) * _chessSize.pery;
                }
                if(c == 6){
                    var topHeight_2 = (i-2) * _chessSize.pery;
                }
            }
            $(".chessMan"+dropChess_1).animate({
                top:"+=" + topHeight_2+"%",
            },500);
            clearDown(dropChess_1,b,c,i);
        }
    }
    function clearDown(a,b,c,i){
        if(c-i>3){
            if(c-i==4){
                $(".chessMan"+a).removeClass("chessMan"+a).addClass("chessMan"+((i+3) * 12 +b)+121);
            }else{
                $(".chessMan"+a).removeClass("chessMan"+a).addClass("chessMan"+((i+3) * 12 +b)+121);
            }
        }else if(i == c-1){
            $(".chessMan"+a).removeClass("chessMan"+a).addClass("chessMan"+((i-(c-3)) * 12 +b));
            for(var index=0;index<c-3;index++){
                $(".chessMan"+((index+3)*12+b)+121).removeClass("chessMan"+((index+3)*12+b)+121).addClass("chessMan"+((index+3)*12+b));
            }
        }else{
            $(".chessMan"+a).removeClass("chessMan"+a).addClass("chessMan"+((i-(c-3)) * 12 +b));
        }
    }
}
//resetting chess index for hir
function clearHir(a,b,c){
    var levTop = 6 - a;
    var length = c;
    for(var y=0;y<(a+1);y++){
        for(var x=0;x<length;x++){
            var x1 = x+b;
            var topHeight_3 =_chessSize.pery;
            var dropChess_1 = y*12+x1;
            $(".chessMan"+dropChess_1).animate({
                top:"+=" + topHeight_3+"%",
            },500);
            clearDowns(dropChess_1,x,y,length,a,b);
        }
    }
    function clearDowns(id,x,y,length,a,b){
        if(y<a){
            $(".chessMan"+id).removeClass("chessMan"+id).addClass("chessMan"+((y+1)*12+x+b)+121);
        }else{
            $(".chessMan"+id).removeClass("chessMan"+id).addClass("chessMan"+((y-a)*12+x+b));
        }
        if(y==a && x == length-1){
            for(var i=0;i<length;i++){
                for(var i2=0;i2<y;i2++){
                    var dropChess_old = (i2-y+a+1)*12 + i+b;
                    $(".chessMan"+dropChess_old+121).removeClass("chessMan"+dropChess_old+121).addClass("chessMan"+dropChess_old);
                }
            }
        }
    }
}
//gameover
function gameOver(){
    $(".gameOver").removeClass("hide");
    getTimeOver = setInterval(function(){
        if(clearTime < 1){
            clearInterval(getTimeOver);
            $(".rightbox").hide();
            music_bg.pause();
            music_ready.pause();
            music_coin.pause();
            $(".ok_time").attr("src","images/o1.png");
        }else{
            $(".ok_time").attr("src","images/o"+clearTime+".png");
        }
        clearTime--;
    },1000);
}
//game uptime
function _upTime(){
    if(upTimeNum == 0){
        try{
            mraid.extend.resume();
        }catch(e){};
        clearInterval(stopIt);
        $(".rightbox").hide();  
        music_bg.pause();
        music_ready.pause();
        music_coin.pause();
    }
    upTimeNum--;
    $(".upTime span").html(upTimeNum);
}
//others
$(".close").click(function(){
    $(".rightbox").hide();
    clearInterval(stopIt);
    music_bg.pause();
    music_ready.pause();
    music_coin.pause();
});

$(".startGame").click(function(){
    loadImg("http://g.cn.miaozhen.com/x/k=2054830&p=77v3e&dx=__IPDX__&rt=2&ns=__IP__&ni=__IESID__&v=__LOC__&xa=__ADPLATFORM__&tr=__REQUESTID__&o=")
    $(".hand").removeClass("hide");
    music_ready.play();
    music_bg.play();
    $(".startGame").hide();
    $(".upTime").removeClass("hide");
    $(".close").removeClass("hide");
    stopIt = setInterval(_upTime,1000); 
});
