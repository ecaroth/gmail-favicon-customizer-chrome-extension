"use strict";

var GFC = (function(){

    var _img_data_uri = null, //base image
        _num_unread = null, //number of unread messages
        _active = false, //is this tab active
        _check_update_frequency = 1000, //how often (in ms) to set/verify favicon
        _favicon = null,
        MSG_RELAY = null;


    function _init(){
        MSG_RELAY = chrome_extension_message_relay( "gmail.favicon", "content", true );
        MSG_RELAY.on('check_email_address', _check_email_address);
        _insert_page_resources();
    }

    function _update_favicon_and_num_messages(){
        var title = document.title
        if(title){
            var num_unread = (title.indexOf('(') != -1) ? parseInt(title.replace(/[^0-9]/g, '')) : 0,
                display_num = num_unread === 0 ? '' : num_unread.toLocaleString();
            if(num_unread > 99) display_num = '99+'
            if(_num_unread != num_unread) {
                var anim = num_unread > _num_unread ? 'pop' : 'none';
                _favicon.badge(display_num, {animation: anim});
                _num_unread = num_unread;
            }
        }
    }

    function _setup_favicon_and_watcher(){
        // Reset current favicon
        const currIcon = document.querySelector('link[rel="shortcut icon"]');
        currIcon.href = _img_data_uri;
        currIcon.type = 'image/png';
        _favicon = new Favico();
        const img = document.createElement('img');
        img.src = _img_data_uri;
        _favicon.image(img);

        setInterval( _update_favicon_and_num_messages, _check_update_frequency );
        _update_favicon_and_num_messages();
    }

    function _check_email_address( data ){
        chrome.storage.local.get('gmail_accounts',function(items){
            var accts = 'gmail_accounts' in items ? items.gmail_accounts :[];
            for( var i=0; i<accts.length; i++) {
                if(accts[i].email==data.email){
                    _active = true;
                    _img_data_uri = accts[i].favicon;
                    break;
                }
            }
            if(_active) _setup_favicon_and_watcher();
        });
    }

    function _insert_page_resources(){
        var elems = [
            chrome.extension.getURL( '/src/shared/message-relay/message_relay.js' ),
            chrome.extension.getURL( '/src/page/page.js' )
        ]
        for(var i=0; i<elems.length; i++) {
            var s = document.createElement('script');
            s.src = elems[i];
            document.head.appendChild(s);
        }
    }

    return{
        init:_init
    };
})();

function wait_for_resources(){
    var needed = [
        typeof(window.chrome_extension_message_relay),
        typeof(window.Favico)
    ];
    if(needed.indexOf('undefined')!==-1) return setTimeout(wait_for_resources,300);
    GFC.init();
}
wait_for_resources();
