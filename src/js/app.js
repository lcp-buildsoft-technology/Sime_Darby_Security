import $$ from "dom7";
import Framework7 from "framework7/framework7.esm.bundle.js";
import sound_audio from './sound_audio.js'

// Import F7 Styles
import "framework7/css/framework7.bundle.css";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.less";
// Import Cordova APIs
import cordovaApp from "./cordova-app.js";
// Import Routes
import routes from "./routes.js";
import request from "./request.js";
import socket from "socket.io-client/dist/socket.io.js";
import CONFIG from "../js/config.js";
var app = new Framework7({
  root: "#app", // App root element
  id: "io.framework7.simedarbysecurity", // App bundle ID
  name: "Sime Darby Security", // App name
  theme: "md", // Automatic theme detection
  
  // App root data

  touch: {
    // Enable fast clicks
    fastClicks: false,
    tapHold: true
  },
  // App root methods
  methods: {
    helloWorld: function() {
      app.dialog.alert("Hello World!");
    }
  },
  // App routes
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus:
      Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered:
      Framework7.device.cordova && !Framework7.device.electron
  },
  // Cordova Statusbar settings
  statusbar: {
    overlay: (Framework7.device.cordova && Framework7.device.ios) || "auto",
    iosOverlaysWebView: true,
    androidOverlaysWebView: false
  },
  view: {
    stackPages: true
  },
  on: {
    init: function() {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }

      var auth = f7.form.getFormData("auth");

      var mainView = f7.views.create(".view-main");

      if (auth) {
        request.post(
          "security_verify_token",
          null,
          { token: auth.token },
          function(data) {
            console.log(auth);

            mainView.router.navigate({ name: "main" });

            mainView.router.clearPreviousHistory();
            var toastCenter = app.toast.create({
              text:
                "<center>Welcome Back!<br>" +
                auth.user.first_name +
                " " +
                auth.user.last_name +
                "</center>",
              position: "center",
              closeTimeout: 2000
            });

            toastCenter.open();
          },
          function(xhr, status) {
            app.form.removeFormData("auth");
            var toastCenter = app.toast.create({
              text: "Your session has expired!<br>Please Login Again!",
              position: "center",
              closeTimeout: 2000
            });

            toastCenter.open();

            mainView.router.navigate("/login/", { force: true });
          }
        );
      } else {
        mainView.router.navigate("/login/");
      }

      var app = this;
      var auth = app.form.getFormData("auth");
    }
  }
});

//directly open boom gate submit btn
$$("#open").on("click", function(e) {
  e.preventDefault();
  var value = $$("[name='reason-radio']:checked").val();
  var auth = app.form.getFormData("auth");
  var formData = new FormData();
  var gate_type = $$("#gate-type").val();
  formData.append("type", gate_type);
  formData.append("reason", value);

  app.dialog.preloader();

  request.get(
    "security_boomgate",
    { Authorization: "JWT " + auth.token },
    null,
    function(data) {
      var url = data;
      console.log(url);
      app.dialog.close();
      app.dialog.preloader("Opening Boom gate...");

      request.post(
        "security_boomgatelog",
        { Authorization: "JWT " + auth.token },
        formData,
        function(data) {
          app.dialog.close();
          console.log(data);
          var toastCenter = app.toast.create({
            text: "Boomgate Open",
            position: "center",
            closeTimeout: 2000
          });

          toastCenter.open();

          app.popup.close();
          var gate_url = "";
          for (var i = 0; i < url.length; i++) {
            if (url[i].type == gate_type) {
              gate_url = url[i].url;
            }
          }

          request.getimg(gate_url, null, function(data) {
            console.log(data);
          });
        }
      );
    },
    function() {
      var toastCenter = app.toast.create({
        text: "Cannot connect boomgate!",
        position: "center",
        closeTimeout: 2000
      });

      toastCenter.open();
    }
  );
});

//set mobile backpress function /////////////////////////////////////////////////////////////////////////////////////////////
function onBackKeyDown() {
  var leftp = app.panel.left && app.panel.left.opened;
  var rightp = app.panel.right && app.panel.right.opened;

  if (leftp || rightp) {
    app.panel.close();
    return false;
  } else if ($$(".modal-in").length > 0) {
    //   app.dialog.close();
    app.popup.close();
    return false;
  } 
  // else if ((app.views.main.router.url == "/walkin/" || app.views.main.router.url == "/impromtu/")) {
  
    
   
    
  // }
   else if (app.views.main.router.url == "/login/") {
    app.dialog.confirm("Are you want to exits?", function() {
      navigator.app.exitApp();
    });
  } else if (app.views.main.router.url == "/scanner/") {
    QRScanner.destroy(function(status) {
      console.log(status);
    });
    app.views.main.router.back({ name: "main" });
  } else if (app.views.main.router.url == "/tour/") {
    QRScanner.destroy(function(status) {
      console.log(status);
    });
    app.views.main.router.back({ name: "main" });
  } else if (app.views.main.router.url == "/main/") {
    app.dialog.confirm("Do you want to Logout?", function() {
     
      app.views.main.router.clearPreviousHistory();
      app.form.removeFormData("auth");
      app.views.main.router.back("/login/", { force: true });
      
    });
  } else {
    app.views.main.router.back();
  }
}

document.addEventListener("backbutton", onBackKeyDown, false);

// end ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var sck = socket.connect(CONFIG.SOCKET);
var auth = app.form.getFormData("auth");
if (auth) {
  //socket

  console.log(auth);
  sck.emit("user", {
    id: auth.user.id,
    area: auth.user.area,
    role: "security"
  });

  document.addEventListener("resume", onResume, false);
  function onResume() {
    setTimeout(function() {
      console.log(sck.connected);
      if (sck.connected == false) {
        sck.emit("user", {
          id: auth.user.id,
          area: auth.user.area,
          role: "security"
        });
      }
    }, 0);
  }

  //socket and prepend to list

  sck.on("visitor_exit", function(data) {
      console.log("visitor exit before")
      console.log(data);
      var toastCenter = app.toast.create({
        text: "<center>Invalid qrcode scanned on exit!</center>",
        position: "center",
        closeTimeout: 5000
      });

      toastCenter.open();
  });


  sck.on("visitor_arrive", function(data) {
    app.dialog.close()
    // console.log(data.status);
    var auth = app.form.getFormData("auth");
    if ($$(app.view.current.router.currentPageEl).data("name") == "visitor") {
      request.get(
        "visitor_entry/" + data.track_id,
        { Authorization: "JWT " + auth.token },
        null,
        function(data) {
          console.log(data);
          var notification_sound =sound_audio.sound;

          notification_sound.play();
          if (data.status != "PEX") {
            var new_entry_item = "";
            var color = "";
            var status = "";

            if (data.status == "AIR") {
              color = "forestgreen";
              status = "Approved";
            } else if (data.status == "RIR") {
              color = "red";
              status = "Rejected";
            } else if (data.status == "PEN") {
              color = "#FB6C5E";
              status = "Pending";
            
            }else if (data.status == "OEN") {
              color = "#FBB35E";
              status = "On Hold";
            }

            var status_id = "status_" + data.tracker_id;
            var card_id = "card_" + data.tracker_id;

            var address = "";
            if (data.entry_type != "I") {
              address = data.lot.name + "," + data.lot.street.name;
            }

            new_entry_item =
              "<div class='card card_in  card_width " +
              card_id +
              " ' >" +
              "<div class='card-content card-click entry_force  content_heigt' visitor_id='" +
              data.tracker_id +
              "'>" +
              '<input type="text" id="visit_id" value="'+data.tracker_id+'" style="display:none">'+
              '<div class="row no-gap">' +
              '<div class="col-20 card-left-content">' +
              '<div class="card-left-content_inner">' +
              '<i class="material-icons">chevron_right</i>' +
              "<p>CHECK IN</p>" +
              " </div>" +
              "</div>" +
              '<div class="col-70 card-center-content">' +
              '<div class="card-center-content_inner">' +
              "<div>" +
              address +
              "</div>" +
              '<div style="width: 100%;">' +
              '<div style="display: inline-block;">' +
              data.visitor_car_plate +
              "</div>" +
              '<div style="display: inline-block;position: absolute; right:0;margin-right:15px;">Status: <b class="' +
              status_id +
              '" style="color: ' +
              color +
              '"> ' +
              status +
              "</b></div>" +
              " </div>" +
              "</div>" +
              "</div>" +
              '<div class="col-10 card-right-content">' +
              '<div class="card-right-content_inner">' +
              ' <i class="material-icons">more_vert</i>' +
              " </div>" +
              " </div>" +
              "</div>" +
              "</div>" +
              " </div>";

            if (data.status == "AIR") {
              setTimeout(function() {
                $$(".approved_entry_list").prepend(new_entry_item);
              }, 2000);
            } else if (data.status == "RIR") {
              setTimeout(function() {
                $$(".rejected_entry_list").prepend(new_entry_item);
              }, 2000);
            } else if (data.status == "PEN") {
              setTimeout(function() {
                $$(".pending_entry_list").prepend(new_entry_item);
              }, 2000);
            
            } else if (data.status == "OEN") {
              setTimeout(function() {
                $$(".onhold_entry_list").prepend(new_entry_item);
              }, 2000);
            }
          } else {
            var card_id = "card_" + data.tracker_id;

            var address = "";
            if (data.entry_type != "I") {
              address = data.lot.name + "," + data.lot.street.name;
            } else {
              address = "Impromtu";
            }

            var new_exit_item =
              '<div class="card  card_in card_width ' +
              card_id +
              '"  >' +
              "<div class='card-content card-click  content_heigt' visitor_id='" +
              data.tracker_id +
              "'>" +
              '<input type="text" id="visit_id" value="'+data.tracker_id+'" style="display:none">'+
              ' <div class="row no-gap">' +
              '<div class="col-20 card-left-content">' +
              '<div class="card-left-content_inner">' +
              ' <i class="material-icons">chevron_left</i>' +
              "<p>CHECK OUT</p>" +
              "</div>" +
              "</div>" +
              '<div class="col-70 card-center-content">' +
              '<div class="card-center-content_inner">' +
              " <div>" +
              address +
              "</div>" +
              " <div>" +
              data.visitor_car_plate +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="col-10 card-right-content">' +
              '<div class="card-right-content_inner">' +
              '<i class="material-icons">more_vert</i>' +
              "</div>" +
              " </div>" +
              "</div>" +
              "</div>" +
              "</div>";

            setTimeout(function() {
              $$(".visitor_scroll_view_out").prepend(new_exit_item);
            }, 2000);
          }
        }
      );
    }else{

      request.get(
        "visitor_entry/" + data.track_id,
        { Authorization: "JWT " + auth.token },
        null,
        function(data) {
          console.log(data);
          if(data.status == "PEX" || data.status == "PEN"){
            var subtittle = "";
            var msg = "";
            if (data.status == "PEX") {
              subtittle="Visitor Exit";
              msg="Visitor is waiting to exit";
            }else if(data.status == "PEN"){
              subtittle="Visitor Entry";
              msg="Visitor is waiting to entry";
            }
            var notification = app.notification.create({
              title: 'Sime Darby Property Community Security',
              titleRightText: 'now',
              subtitle: subtittle,
              text: msg,
              closeTimeout: 3000,
            });

            notification.open();
            app.views.main.router.navigate({name:"visitor"});
          }
         
      
        }
        );



    }
  });

  

  //remove card item
  sck.on("visitor_remove", function(data) {
    if (
      $$(app.view.current.router.currentPageEl).data("name") == "visitor" ||
      $$(app.view.current.router.currentPageEl).data("name") == "history"
    ) {
      $$(".card_" + data.track_id).removeClass("card_in");
      setTimeout(function() {
        $$(".card_" + data.track_id).addClass("card_out");
      }, 500);
      setTimeout(function() {
        $$(".card_" + data.track_id).remove();
      }, 1500);
    }
  });
}
$$(document).on("click", ".cancel", function() {
  if (app.views.main.router.url == "/scanner/") {
    QRScanner.destroy(function(status) {
      console.log(status);
    });

    app.views.main.router.back({ name: "main" });
  } else if (app.views.main.router.url == "/tour/") {
    QRScanner.destroy(function(status) {
      console.log(status);
    });

    app.views.main.router.back({ name: "main" });
  } else {
    app.popup.close();
  }

  return false;
});




$$("#app").on("click", ".update-btn", function() {
  var auth = app.form.getFormData("auth");
  console.log(navigator.connection.type)
  console.log($$(this));
  var action = $$(this).attr("action");
  var entry_id = $$(this).attr("id");
  var force_open =  $$(this).attr("force_open");
  console.log(action);
  console.log(entry_id);
  var up_status = "";
  var post_request = false;
  if (action == "approved") {
    up_status = "AIS";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
   
    
  } else if (action == "reject") {
    up_status = "RIS";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
  } else if (action == "reject_exit") {
    up_status = "ROS";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
  } else if (action == "approved_exit") {
    up_status = "AOS";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
  } else if (action == "register") {
    up_status = "RIS";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
  } else if (action == "check_out") {
    up_status = "AOS";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
  
  } else if (action == "onhold") {
    up_status = "OEN";
    if (app.device.desktop) {
      post_request = true;
    }else{
      if (navigator.connection.type === "wifi" ) {
      post_request = true;
      console.log(true)
    } else {
      var dialog1 = app.dialog.create({
          title: 'Open Boom Gate Failed',
          text: 'Please change your connection internet to WIFI, Thank You',
          buttons: [
            {
              text: 'Close',
              onClick: function () {
                app.dialog.close();
              }
            }
          ]
        })

        dialog1.open()
        post_request = false;
      console.log(false)
    }
  }
  }

  if (post_request == true) {
    app.dialog.preloader();
    request.put(
      "visitor_entry/" + entry_id,
      { Authorization: "JWT " + auth.token },
      {
        entry_id :entry_id,
        status: up_status,
        force_open: force_open,
      },
      function(data) {
        app.dialog.close();
        var toastCenter = app.toast.create({
          text: "<center>Entry Update Success!</center>",
          position: "center",
          closeTimeout: 2000
        });

        toastCenter.open();

        app.popup.close();

        if (action == "register") {
          app.dialog.preloader();
          request.get(
            "visitor_entry/" + entry_id,
            { Authorization: "JWT " + auth.token },
            null,
            function(data) {
              app.dialog.close();
              app.form.storeFormData("register_data", data);
              app.popup.close();
              app.views.main.router.navigate({ name: "walkin" });
            }
          );
        } else if (action == "onhold"){

      }else{
          app.dialog.preloader();
          request.get(
            "security_boomgate",
            { Authorization: "JWT " + auth.token },
            null,
            function(data) {
              app.dialog.close();
              var url = data;
              console.log(url);
              var gate_url = "";
              var gate_type = "";
              if (up_status == "AOS") {
                gate_type = "X";
              }

              if (up_status == "AIS" || up_status == "RIS") {
                gate_type = "E";
              }

              for (var i = 0; i < url.length; i++) {
                if (url[i].type == gate_type) {
                  gate_url = url[i].url;
                }
              }

              app.dialog.preloader("Opening Boom gate...");

              request.getimg(
                gate_url,
                null,
                function(data) {
                  console.log(data);
                  app.dialog.close();
                  console.log("boom gate open")
                  var toastCenter = app.toast.create({
                    text: "Boomgate Open",
                    position: "center",
                    closeTimeout: 2000
                  });

                  toastCenter.open();
                },
                function() {
                  app.dialog.close();
                  var toastCenter = app.toast.create({
                    text: "Cannot connect boomgate!",
                    position: "center",
                    closeTimeout: 2000
                  });

                  toastCenter.open();
                }
              );
            },
            function() {
              app.dialog.close();
              var toastCenter = app.toast.create({
                text: "Cannot connect boomgate!",
                position: "center",
                closeTimeout: 2000
              });

              toastCenter.open();
            }
          );
        }
      },
      function(xhr, status) {
        var toastCenter = app.toast.create({
          text: "<center>Entry Update Failed!</center>",
          position: "center",
          closeTimeout: 2000
        });

        toastCenter.open();
        app.dialog.close();
      }
    );
  } else {
    if (action == "back") {
      app.popup.close();
    } else if (action == "register") {
      console.log("re-register");
    }
  }
});

$$(document).on("click", ".log_details", function() {
  var latitude = 0;
  var longitude = 0;
  var value = $$(this).attr("value"); //get cuurent clicked adress ownner's phone number
  console.log(value);
  var auth = app.form.getFormData("auth");
  app.dialog.preloader();
  request.get(
    "security_postlog/" + value,
    { Authorization: "JWT " + auth.token },
    null,
    function(data) {
      console.log(data);
      app.form.storeFormData("tour_log", data);
      app.dialog.close();
      app.views.main.router.navigate({ name: "tour_log" });
    },
    function(xhr, status) {
      console.log(xhr);
      app.dialog.close();

      var toastCenter = app.toast.create({
        text: "Connection Error!",
        position: "center",
        closeTimeout: 3000
      });

      toastCenter.open();
    }
  );
});

// contact module, longpress function
$$("#app").on("taphold", ".phone_call", function() {
  var house_id = $$(this).attr("house_id"); //get cuurent longpress house member contact list
  console.log(house_id);
  var auth = app.form.getFormData("auth");
  app.dialog.preloader();
  request.get(
    "get_primary/family",
    { Authorization: "JWT " + auth.token },
    { id: house_id },
    function(data) {
      console.log(data);
      app.dialog.close();

      var contact_list = [];
      for (var i = 0; i < data.length; i++) {
        var k =0
        var phone_num = data[k].resident.user.profile.phone_number;
        var contact = {
          text:
            data[i].resident.user.first_name +
            " " +
            data[i].resident.user.last_name,
          // onClick: function() {
          //   console.log(phone_num);
          //   console.log(data,i);
          //   if (app.device.android) {
          //     console.log("android calling");
          //     document.location.href = "tel:" + phone_num;
          //   } else {
          //     var toastCenter = app.toast.create({
          //       text: "Cannot make phone call on Web, long press",
          //       position: "center",
          //       closeTimeout: 2000
          //     });

          //     toastCenter.open();
          //   }
          // }
        };

        contact_list.push(contact);
        
      }

      var close_btn = {
        text: "Close",
        onClick: function() {
          app.dialog.close();
        }
      };

      contact_list.push(close_btn);

      var family_dialog = app.dialog
        .create({
          title: "Family List",
          text: "Select a resident to call",
          buttons: contact_list,
          onClick: function(dialog, index) {
            console.log("android calling");
            document.location.href = "tel:" + data[index].resident.user.profile.phone_number;
          },
          verticalButtons: true
          
        })
        .open();
    },
    function(error) {
      app.dialog.close();

      var toastCenter = app.toast.create({
        text: "Family List Not Found!",
        position: "center",
        closeTimeout: 2000
      });

      toastCenter.open();
    }
  );
});
