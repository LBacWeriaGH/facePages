(function(window){
    var appPublic = {

        demoVersion : "demo1.0",

        baseFilterPath : "common index login pages resources language",

        basePathStr : "",
        // 基础类
        isArray(_value){
            return _value && typeof _value === 'object' && typeof _value.length === 'number' && typeof _value.splice === 'function' && !(_value.propertyIsEnumerable('length'));
        },

        isObject(_value){
            return _value && typeof _value == "object"
        },

        isNullOrUndefine(_value){
            return _value && typeof _value != "null" && typeof _value != "undefine"
        },

        checkStringSub(_string, _sub){
            if (_string) {
                if (_string.indexOf(_sub) >= 0) {
                    return true;
                }
            }
            return false;
        },

        round(_data, _length){
            var length = _length ? _length : 2;
            return (Array(length).join("0") + _data).slice(-length);
        },

        //功能类
        locationBasePath(){
            var that = this;
            if (that.basePathStr && that.checkStringSub(window.location.pathname, that.basePathStr + "/")) {
                return that.basePathStr;
            }

            var pathnameArr = window.location.pathname.split("/");
            if (pathnameArr.length > 1) {
                var basePath = pathnameArr[1],
                    isBathPath = function(_string){
                        if (that.checkStringSub(_string, ".html") ||
                            that.checkStringSub(_string, ".js") ||
                            that.checkStringSub(_string, ".css")) {
                            return false;
                        }
                        if (that.checkStringSub(that.baseFilterPath, _string)) {
                            return false;
                        }
                        return true;
                    }
                if (basePath && isBathPath(basePath)) {
                    that.basePathStr = "/" + basePath;
                }
            }
            return that.basePathStr;
        },

        getValidUrl(_url){
            var that = this,
                basePath = that.locationBasePath();
            if (that.checkStringSub(_url, basePath + "/")) {
                return _url;
            }

            return _url.slice(0, 1) == "/" ? basePath + _url : _url;
        },

        getFileFingerPrint(_version){
            var that = this,
                versionDate = new Date();
            return (_version || "") + "_" + that.round(versionDate.getFullYear(), 4) + that.round(versionDate.getMonth()) + that.round(versionDate.getDate()) 
                + that.round(versionDate.getHours()) + that.round(versionDate.getMinutes()) + that.round(versionDate.getSeconds());
        },

        createUrlElement(_type, _url){
            var that = this,
                uri = _url ? _url + "?_=" + that.getFileFingerPrint(that.demoVersion) : "";
                node  = document.createElement(_type);
            if (_type === 'script') {
                node.charset = 'utf-8';
                node.src = uri;
            } else if (_type === 'link') {
                node.rel = 'stylesheet';
                node.type = 'text/css';
                node.href = uri;
            } else if (_type === 'img') {
                node.src = uri;
                node.alt = "";
            } else {
                node = null;
            }

            return node;
        },

        loadUrlElement(_type, _url, _callback){
            var that = this,
                node = (("link" == _type || "script" == _type) && _url) ? that.createUrlElement(_type, that.getValidUrl(_url)) : null;
                parentNode = (("link" == _type ? document.head : document.body) || document.documentElement);

            if (!that.isNullOrUndefine(node)) {
                return null;
            }

            var oldNodeList = document.querySelectorAll(_type + "[data-url='" + _url + "']");
            for (var i = 0; i < oldNodeList.length; i++){
                parentNode.removeChild(oldNodeList[i]);
            }

            node.setAttribute("data-url", _url);
            node.onload = node.onreadyStateChange = function(){
                var state = node.readyState;
                if ("undefined" === typeof state || "loaded" === state || "complete" === state) {
                    try{
                        _callback && _callback();
                    } finally {
                        node.onload = node.onreadyStateChange = null;
                        node = null;
                    }
                }
            };

            node.onerror = function(){
                _callback && _callback(false)
            }

            if (_type === 'script') {
                node.async = _callback ? true : false;  //此属性没有同步加载的效果，需要回调控制先后
            }
            parentNode.appendChild(node);

            return node;
        },
        /**
         * function 批量加载依赖css
         * @param {*} _fileList  文件路径数组
         * @returns 
         */
        loadCssFile(_fileList){
            var that = this;
            if (!that.isArray(_fileList)) {
                console.log(that.isArray(_fileList))
                return;
            }
            for (var i = 0; i < _fileList.length; i++){
                if (!that.checkStringSub(_fileList[i], ".css")) {
                    continue;
                }
                that.loadUrlElement("link", _fileList[i]);
            }
        },

        loadJsFile(_fileList, _callback){
            var that = this;
            if (!that.isArray(_fileList)) {
                return;
            }
            var callLoadAppJsFile = function(){
                var fileLength = _fileList.length,
                    callBackFunc = null;
                if (_callback){
                    callBackFunc = function(){
                        fileLength --;
                        if ( 0 == fileLength) {
                           _callback();
                        }
                    }
                }

                for (var i = 0; i <= fileLength; i++){
                    if (that.checkStringSub(_fileList[i], "resources")) {
                        callBackFunc && callBackFunc();
                        continue;
                    }
                    if (!that.checkStringSub(_fileList[i], ".js")){
                        callBackFunc && callBackFunc();
                        continue;
                    }
                    that.loadUrlElement("script", _fileList[i], callBackFunc);
                }
            }

            if ("resources" == _fileList[0]) {
                that.loadUrlElement("script", "/resources/jquery-1.12.4.min.js");
                callLoadAppJsFile();
            }else{
                callLoadAppJsFile();
            }
        },
    }
    window.appPublic = appPublic;
    return window;
})(window);