(function(window){
    var login = {
        init : function(){
            var that = this;
            appCommon.lang(function(){
                //待开发
            });
            //添加图片
            $(".con-box.left p:first-of-type").after(appPublic.createUrlElement("img", "pages/login/loginLeft.png"));
            $(".con-box.right p:first-of-type").after(appPublic.createUrlElement("img", "pages/login/loginRight.png"));
            
            //按钮触发
            $loginButton = $(".con-box.left button:first-of-type")[0];
            that.styleChangeModel($loginButton, "login");
            $registerButton = $(".con-box.right button:first-of-type")[0];
            that.styleChangeModel($registerButton, "register");

        },

        styleChangeModel:function(_widget, _type){
            var that = this,
                loginBox = $(".login-box")[0],
                registerBox = $(".register-box")[0],
                formBox = $(".form-box")[0];

            if (_type == "register") {
                _widget.addEventListener("click",()=>{
                    formBox.style.transform = "translateX(80%)";
                    loginBox.classList.add("hidden");
                    registerBox.classList.remove("hidden");
                })
            }
            if(_type == "login"){
                _widget.addEventListener("click",()=>{
                    formBox.style.transform = "translateX(0%)";
                    registerBox.classList.add("hidden");
                    loginBox.classList.remove("hidden");
                })
            }
        }
    }
    window.login = login;
})(window);