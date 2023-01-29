(function(window){
    var appCommon = {
        lang(_callback){
            setLangToPage = function(){
                console.log($("[data-lang]"))
                $("[data-lang]").each(function (index,el) {
                    console.log(window.lang)
                    var langAttr = window.lang[$(el).attr('data-lang')];
                    if(! langAttr){
                        langAttr = " "
                    }
                    console.log(el.tagName.toLowerCase())
                    switch (el.tagName.toLowerCase()) {
                        case "input":
                            $(el).prop("placeholder", langAttr);
                            break;
                        case "img":
                            $(el).prop("title", langAttr);
                            break;
                        case "a":
                            $(el).prop("title", langAttr);
                            break;
                        default:
                            $(el).text(langAttr);
                            break;
                    }
                });
                _callback && _callback();
            }

            setLangToPage();
        }
    }
    return window.appCommon = appCommon;
})(window);