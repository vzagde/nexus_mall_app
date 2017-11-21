var base_url = 'http://leasing.nexusmalls.com/index.php/loader';
var mall_id = 0;
var event_id = 0;
var store_category_id = 0;
var start_date_test = '';
var end_date_test = '';
function j2s(json) {
    return JSON.stringify(json);
}

function goto_page(page) {
    if (page == 'tabs.html') {
        if (!load_ui) {
            return false;
        } else {
            load_ui = Lockr.get('load_ui');
            mainView.router.load({
                url: page,
                ignoreCache: false,
            });
        }
    } else {
        mainView.router.load({
            url: page,
            ignoreCache: false,
        });
    }
}

function login(){
    var emp_code = $('#emp_code').val();

    if (!emp_code) {
        alert('Employee code should not be blank.');
    } else {
        myApp.showIndicator();
        $.ajax({
            url: base_url + '/login_user',
            type: 'POST',
            crossDomain: true,
            data: {
                "emp_code": emp_code,
            },
        })
        .done(function(res) {
            myApp.hideIndicator();
            Lockr.set('login_status', 'status');
            if (res.status == 'SUCCESS') {
                mainView.router.load({
                    url: 'sync.html',
                    ignoreCache: false,
                 });
            } else {
                myApp.alert('Invalid Employee Code');
            }
        })
        .fail(function(err) {
            myApp.hideIndicator();
            myApp.alert('Some error occurred on connecting.');
        })
        .always(function() {});
    }

}

function zip_unzip_code() {
    $('.progress_text').text('PAGES DOWNLOAD COMPLETE. ASSETS DOWNLOAD WILL START IN SOMETIME...');
    $('.bar_fill').animate({"width":"10%"});
    $('.heart').animate({"margin-left":"8%"});

    var directory;
    if (cordova.file.documentsDirectory) {
        directory = cordova.file.documentsDirectory; // for iOS
    } else {
        directory = cordova.file.externalRootDirectory;
    }
    var file_download =  directory+"/Archive.zip";

    var fileTransfer = new FileTransfer();
    var uri = encodeURI("http://leasing.nexusmalls.com/Archive.zip");
    $('.progress_text').text('INITIATED FILE ASSETS TRANSFER');
    $('.bar_fill').animate({"width":"25%"});
    $('.heart').animate({"margin-left":"23%"});

    fileTransfer.download(
        uri,
        file_download,
        function(entry) {
            $('.progress_text').html('DOWNLOADING ASSET FILES. <br> THIS PROCESS WILL TAKE TIME, PLEASE WAIT...');
            $('.bar_fill').animate({"width":"50%"});
            $('.heart').animate({"margin-left":"48%"});
            zip.unzip(file_download, directory,function (event){
                $('.bar_fill').animate({"width":"100%"});
                $('.heart').animate({"margin-left":"98%"});
                $('.progress_text').text('THANK YOU FOR DOWNLOADING, YOU CAN CONTINUE USING THE APPLICATION.');
                $('.p_t1').fadeIn();
            }, function(progressEvent) {
            });
        },
        function(error) {
           alert("download error source " + error.source);
           alert("download error target " + error.target);
           alert("download error code" + error.code);
        }, false, {
        }
    );

   // zip.unzip('http://kreaserv-tech.com/Archive.zip', cordova.file.dataDirectory + 'files/download/', function success_callbak() {
   //     console.log('Success');
   // }, function progress_callbak() {
   // });
}

function download_image(){
    $('.box_height').animate({
        "height": "100%"
    }, 1000);
    $('.login_box').hide();
    $('.progress_box').show();
    var send_url = cordova.file.documentsDirectory;
    $.ajax({
        url: base_url+"/load_ui",
        type: 'POST',
        crossDomain: true,
        data: {
            send_url : send_url,
        }
    })
    .done(function(res) {
        load_ui = res;
        Lockr.set('load_ui', load_ui);
        // load_location_ui();
        zip_unzip_code();

    })
    .fail(function(err) {
        myApp.hideIndicator();
        myApp.alert('Some error occurred on connecting.');
    })
    .always(function() {
        myApp.hideIndicator();
    });
}

function load_mall_page(id) {
    mall_id = Number(id);
    goto_page('mall_facts.html');
}

function load_event_details_page(id) {
    event_id = id;
	start_date_test = new Date($(".display_event_id"+event_id).data('startdate'));
	end_date_test = new Date($(".display_event_id"+event_id).data('enddate'));
    goto_page('event_inner.html');
}

function load_stores_inner(id) {
    store_category_id = id;
    goto_page('store_inner.html');
}

function logout(){
    Lockr.flush();
    mainView.router.load({
        url: 'index.html',
        ignoreCache: false,
    });
}

function load_location_ui() {
    mainView.router.load({
        url: 'location.html',
        query: {
            loaction_load_status: 'true',
        },
        ignoreCache: false,
    });
}