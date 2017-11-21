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
    var directory;
    if (cordova.file.documentsDirectory) {
        directory = cordova.file.documentsDirectory; // for iOS
    } else {
        directory = cordova.file.externalRootDirectory;
    }
    var file_download =  directory+"/Archive.zip";

    var fileTransfer = new FileTransfer();
    var uri = encodeURI("http://kreaserv-tech.com/Archive.zip");

    fileTransfer.download(
        uri,
        file_download,
        function(entry) {
            zip.unzip(file_download, directory,function (){
                console.log('file unzip Success');
                $('.bar_fill').animate({"width":"100%"});
                $('.heart').animate({"margin-left":"98%"});
                $('.progress_text').text('THANK YOU FOR DOWNLOADING ');
                $('.p_t1').fadeIn();
            });
            console.log("download complete: " + entry.toURL());
        },
        function(error) {
           console.log("download error source " + error.source);
           console.log("download error target " + error.target);
           console.log("download error code" + error.code);
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
    // myApp.showIndicator();
    $('.login_box').hide();
    $('.progress_box').show();
    var send_url = cordova.file.dataDirectory + 'files/download/';
    // myApp.showIndicator();
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
    // $.ajax({
    //     url: base_url + '/laod_image',
    //     type: 'POST',
    //     crossDomain: true,
    // })
    // .done(function(res) {
    //     // $('.bar_fill').animate({"width":"100%"});
    //     // myApp.hideIndicator();
    //     // myApp.alert('Activating Download Process');
    //     var counter_i = 1;
    //     var arr_length = Number(res.download_images.length) - 1;
    //     var animate_count = 100/Number(res.download_images.length);
    //     var animate_counter = animate_count;
    //     $.each(res.download_images, function(index, value) {
    //         window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fs){
    //             fs.root.getDirectory('download', { create: true });
    //             var filePath = cordova.file.dataDirectory+'files/download/'+value.icon;
    //             var fileTransfer = new FileTransfer();
    //             var uri = encodeURI(decodeURIComponent("http://leasing.nexusmalls.com/assets/app_assets/images/"+value.icon));


    //             setTimeout(function() {
    //                 fileTransfer.download(uri,filePath,function(entry) {
    //                     console.log("Successfully downloaded file, full path is "+filePath);
    //                     $('.bar_fill').animate({"width":+animate_count+"%"});
    //                     $('.heart').animate({"margin-left":+(Number(animate_count)-2)+"%"});
    //                     counter_i = counter_i + 1;
    //                     animate_count = animate_count + animate_counter;
    //                     if (animate_count > 99) {
    //                         $('.progress_text').text('THANK YOU FOR DOWNLOADING ');
    //                         $('.p_t1').fadeIn();
    //                     }
    //                 }, function(error) {
    //                     console.log("Some error"+error.code+" for "+uri);
    //                 }, false);
    //             }, 500);
    //         });

    //         // $.each(value, function(i, v) {
    //         // var fileTransfer = new FileTransfer();
    //         // var uri = encodeURI("http://leasing.nexusmalls.com/assets/app_assets/images/"+value.icon);
    //         // // console.log(value.icon);
    //         // fileTransfer.download(uri, cordova.file.dataDirectory+'files/download/'+value.icon,
    //         //     function(entry) {
    //         //         console.log()
    //         //         $('.bar_fill').animate({"width":+animate_count+"%"});
    //         //         $('.heart').animate({"margin-left":+(Number(animate_count)-2)+"%"});
    //         //         counter_i = counter_i + 1;
    //         //         animate_count = animate_count + animate_counter;
    //         //         if (animate_count > 99) {
    //         //             $('.progress_text').text('THANK YOU FOR DOWNLOADING ');
    //         //             $('.p_t1').fadeIn();
    //         //         }
    //         //         // var fileTransfer = new FileTransfer();
    //         //         // $('.bar_fill').animate({"width":+animate_count+"%"});
    //         //         // $('.heart').animate({"margin-left":+(Number(animate_count)-2)+"%"});
    //         //     },
    //         //     function (error) {
    //         //         console.log("Download failed with error "+error);
    //         //     }
    //         // );
    //             // })
    //         // fileTransfer.download(
    //         //     uri,
    //         //     cordova.file.dataDirectory+'files/download/'+value.icon,
    //         //     function(entry) {
    //         //         // $.each(entry, function(index, value){
    //         //         //     console.log(value);
    //         //         // })
    //         //         var fileTransfer = new FileTransfer();
    //         //         $('.bar_fill').animate({"width":+animate_count+"%"});
    //         //         $('.heart').animate({"margin-left":+(Number(animate_count)-2)+"%"});
    //         //         // if (arr_length == counter_i) {
    //         //         //     // $('.progress_text').text('THANK YOU FOR DOWNLOADING ');
    //         //         //     // $('.p_t1').fadeIn();
    //         //         // }
    //         // });

    //         // console.log(cordova.file.dataDirectory + 'files/download/'+value.icon);
    //         // console.log("Index value: "+index);
    //         // console.log("Array Lenght: "+arr_length);
    //     })

    //     var send_url = cordova.file.dataDirectory + 'files/download/';
    //     // myApp.showIndicator();
    //     $.ajax({
    //         url: base_url+"/load_ui",
    //         type: 'POST',
    //         crossDomain: true,
    //         data: {
    //             send_url : send_url,
    //         }
    //     })
    //     .done(function(res) {
    //         load_ui = res;
    //         Lockr.set('load_ui', load_ui);
    //         // load_location_ui();
    //     })
    //     .fail(function(err) {
    //         myApp.hideIndicator();
    //         myApp.alert('Some error occurred on connecting.');
    //     })
    //     .always(function() {
    //         myApp.hideIndicator();
    //     });
    // })
    // .fail(function(err) {
    //     myApp.hideIndicator();
    //     myApp.alert('Some error occurred on connecting.');
    // })
    // .always(function() {});
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