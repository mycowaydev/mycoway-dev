function changeLanguage(lang) {
    if (lang){
        $('#selected_language').removeClass('flag-icon-gb')
        $('#selected_language').removeClass('flag-icon-cn')
        $('#selected_language').removeClass('flag-icon-my')
        if (lang == "en"){
            sessionStorage.setItem("language", "en");
            lang_array = language_en
            $('#selected_language').addClass('flag-icon-gb')
        } else if (lang == "cn") {
            sessionStorage.setItem("language", "cn");
            lang_array = language_cn
            $('#selected_language').addClass('flag-icon-cn')
        } else {
            sessionStorage.setItem("language", "my");
            lang_array = language_my
            $('#selected_language').addClass('flag-icon-my')
        }
        for (k in lang_array) {
            element = $('.'+k)
            if (lang_array[k]){
                if (element){
                    if (k.startsWith("string_")){
                        element.html(lang_array[k])
                    } else if (k.startsWith("placeholder_")){
                        element.attr("placeholder", lang_array[k]);
                    }
                }
            }
        }
    }
}

$(document).ready(function(){
    var lang = "en"
    if (window.sessionStorage.getItem("language") != null){
        lang = window.sessionStorage.getItem("language")
    }
    changeLanguage(lang)
});