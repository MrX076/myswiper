/**
 * Created by Administrator on 2018/8/22 0022.
 */
function sSlide(box,imgbox,oLeft,oRight,oBtn,btnContent){
    this.box        = box;
    this.imgbox     = imgbox;
    this.oLeft      = oLeft;
    this.oRight     = oRight;
    this.oBtn       = oBtn;
    this.btnContent = btnContent;
    this.slidefree  = slidefree;
    this.slideClick = slideClick;
    this.slideBtn   = slideBtn;
    this.getLength  = getLength;
    this.getLoad    = getLoad;
    this.addBtn     = addBtn;
    this.btnChange  = btnChange;
}
function  getLoad(){
    var _this = this;
    this.getLength();
    this.slidefree();
    this.slideClick();
    this.addBtn();
    this.slideBtn();
    this.btnChange(_this);
}
function getLength(){
    var len = $(this.imgbox).children().length*800;
    $(this.imgbox).css("width", len+"px");
}

function slidefree(){
    var _this = this;
    var oW = $(_this.imgbox).children().length-1;
    var oWidth =-oW*800;
    var setInt = setInterval(function(){
        var nleft = parseInt($(_this.imgbox).css("left"))
        if(nleft<=0&&nleft>oWidth) {
            nleft -= 800;
            $(_this.imgbox).css("left", nleft + "px");
        }
        else{
            $(_this.imgbox).css("left", "0px");
        }

        btnChange(_this);

    },2000)

    $(_this.box).mouseenter(function(){
        clearInterval(setInt);
    })

    $(_this.box).mouseleave(function(){
        setInt = setInterval(function(){
            var nleft = parseInt($(_this.imgbox).css("left"));
            if(nleft<=0&&nleft>oWidth) {
                nleft -= 800;
                $(_this.imgbox).css("left", nleft + "px");
            }
            else{
                $(_this.imgbox).css("left", "0px");
            }
            btnChange(_this);
        },2000)
    })
}

function addBtn(){
    var len = $(this.imgbox).children().length;
    var oSpan="";
    for(var i=1;i<=len;i++){
        if(i==1){
            oSpan+= "<span class='active'>"+i+"</span>"
        }else{
            oSpan+= "<span>"+i+"</span>"
        }
    }
    $(this.btnContent).html(oSpan);
}

function btnChange(_this){
    var index = -parseInt($(_this.imgbox).css("left"))/800;
   var now = $(_this.btnContent).children()[index];
    $(now).addClass("active");
    $(now).siblings().removeClass("active");
}

function slideBtn(){
    var _this = this;
    $(this.oBtn).on("click","span",function(event){
        var n =$(event.target).html();
        $(event.target).addClass("active");
        $(event.target).siblings().removeClass("active");
        var nleft = (n-1)*-800;
        $(_this.imgbox).css("left", nleft+"px");
    })
}

function slideClick(){
    //点击左边left
    var _this = this;
    var oW = $(this.imgbox).children().length-1;
    var oWidth =-oW*800;
    $(this.oLeft).on("click",function(){
        var nleft = parseInt($(_this.imgbox).css("left"))
        if(nleft<=0&&nleft>oWidth) {
            nleft -= 800;
            $(_this.imgbox).css("left", nleft + "px");
        }
        else{
            $(_this.imgbox).css("left", "0px");
        }
        btnChange(_this);
    })
    //点击右边
    $(this.oRight).on("click",function(){
        var nleft = parseInt($(_this.imgbox).css("left"))
        if(nleft<0&&nleft>=oWidth) {
            nleft += 800;
            $(_this.imgbox).css("left", nleft + "px");
        }
        else{
            $(_this.imgbox).css("left", oWidth+"px");
        }
        btnChange(_this);
    })
}

