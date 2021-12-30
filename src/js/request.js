import config from './config.js'
import Framework7 from 'framework7/framework7.esm.bundle.js';


import socket from 'socket.io-client/dist/socket.io.js';


var sck = socket.connect(config.SOCKET);
     
console.log(sck.disconnected)
 var offline_mode = sck.disconnected 
 function post(url,header,data,off, success, error) {
    if(offline_mode == false){
        Framework7.request({
            url: config.BASE_URL + url + '/',
            method: "POST",
            headers :header,
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            
            dataType: 'json',
            success: function(data){
                success(data);
            },
            error: function(xhr,status){
                error(xhr,status);
            }
        })
    }else{
        Framework7.request({
            url: config.BASE_URL_OFF + url + '/',
            method: "POST",
            headers :header,
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            
            dataType: 'json',
            success: function(data){
                success(data);
            },
            error: function(xhr,status){
                error(xhr,status);
            }
        })
    }   
}
function postFormData(url,header,data,off, success, error) {
    if(offline_mode == false){
        Framework7.request({
            url: config.BASE_URL + url + '/',
            method: "POST",
            headers :header,
            contentType: 'multipart/form-data',
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function(data){
                success(data);
            },
            error: function(xhr,status){
                error(xhr,status);
            }
        })
    }else{
        Framework7.request({
            url: config.BASE_URL_OFF + url + '/',
            method: "POST",
            headers :header,
            contentType: 'multipart/form-data',
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function(data){
                success(data);
            },
            error: function(xhr,status){
                error(xhr,status);
            }
        })

    }
}

function get(url,header,data,off, success, error,complete) {
    if(offline_mode == false){

        Framework7.request({
            url: config.BASE_URL + url + '/',
            method: "GET",
            headers :header,
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function(data){
                success(data);
            },
            error: function(xhr,status){
                error(xhr,status);
            },
            complete: function(xhr,status){
                if(complete){
                    complete(xhr,status);
                }
            },
        })
    }else{
        Framework7.request({
            url: config.BASE_URL_OFF + url + '/',
            method: "GET",
            headers :header,
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function(data){
                success(data);
            },
            error: function(xhr,status){
                error(xhr,status);
            },
            complete: function(xhr,status){
                if(complete){
                    complete(xhr,status);
                }
            },
        })
    }
}


function put(url,header,data,success,error,complete){
    Framework7.request({
        url: config.BASE_URL + url + '/',
        method: "PUT",
        headers :header,
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: data,
        dataType: 'json',
        success: function(data){
            success(data);
        },
        error: function(xhr,status){
            error(xhr,status);
        },
        complete: function(xhr,status){
            if(complete){
                complete(xhr,status);
            }
        },
    })
}


function getimg(url,header, success, error,complete) {
    Framework7.request({
        url: url,
        method: "GET",
        headers :header,
        async:true,
        timeout:20000,
        crossDomain: true,
        xhrFields:{
            responseType: 'blob'
        },
        success: function(data){
            success(data);
        },
        error: function(xhr,status){
            error(xhr,status);
        },
        complete: function(xhr,status){
            if(complete){
                complete(xhr,status);
            }
        },
    })
}


function getjson(url,header, success, error,complete) {
    Framework7.request({
        url: url,
        method: "GET",
        headers :header,
        async:true,
        timeout:1500,
        crossDomain: true,
        xhrFields:{
            responseType: 'blob'
        },
        success: function(data){
            success(data);
        },
        error: function(xhr,status){
            error(xhr,status);
        },
        complete: function(xhr,status){
            if(complete){
                complete(xhr,status);
            }
        },
    })
}


function getNext(url,header,success,error,complete){
    Framework7.request({
        url: url,
        method: "GET",
        headers :header,
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        dataType: 'json',
        success: function(data){
            success(data);
        },
        error: function(xhr,status){
            error(xhr,status);
        },
        complete: function(xhr,status){
            if(complete){
                complete(xhr,status);
            }
        },
    })
}
export default {post,get,getNext,getimg,postFormData,put}