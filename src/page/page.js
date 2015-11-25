"use strict";

window.GMAIL_FAVICON_CUSTOMIZER = (function(){

    var _user_email = null,
        _globals = typeof GLOBALS !== 'undefined' ? GLOBALS : ( typeof window.opener.GLOBALS !== 'undefined' ? window.opener.GLOBALS : [] ),
        MSG_RELAY = null;

    function _init(){
        MSG_RELAY = chrome_extension_message_relay( "gmail.favicon", "page", true );
        //get user's email
        _user_email = _globals[10];
        MSG_RELAY.send( 'check_email_address', MSG_RELAY.levels.content, {email:_user_email} )
    }

    return{
        init:_init
    }
})();


function wait_for_gfc_resources(){
    if( typeof(chrome_extension_message_relay) === 'undefined' ) return setTimeout(wait_for_gfc_resources,300);
    GMAIL_FAVICON_CUSTOMIZER.init();
}
wait_for_gfc_resources();