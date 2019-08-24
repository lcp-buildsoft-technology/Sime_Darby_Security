import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';
import request from './request.js';
var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.simedarbysecurity', // App bundle ID
  name: 'Sime Darby Security', // App name
  theme: 'auto', // Automatic theme detection

  // App root data
  data: function () {
    return {
      user: {
        firstName: 'simedarby',
        lastName: 'property',
      },

    };
  },
  touch: {
    // Enable fast clicks
    fastClicks: true,
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,



  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }

      var auth = f7.form.getFormData("auth");



      if(auth){
        
        request.post("security_verify_token",null,{"token":auth.token}, function(data){
        
        var mainView = f7.views.create('.view-main');
        console.log(auth);
        mainView.router.navigate({name:"main"});
        mainView.router.clearPreviousHistory();
        var toastCenter = app.toast.create({
          text: "<center>Welcome Back!<br>"+auth.user.first_name+" "+auth.user.last_name+"</center>",
          position: 'center',
          closeTimeout: 2000,
        });
      
        toastCenter.open();




      },
      function(xhr,status){
      if(status==400){
        app.form.removeFormData('auth');
        var toastCenter = app.toast.create({
          text: "Your session has expired!<br>Please Login Again!",
          position: 'center',
          closeTimeout: 2000,
        });
      
        toastCenter.open();
      
      }else{
        var toastCenter = app.toast.create({
          text: "Something error when login!",
          position: 'center',
          closeTimeout: 2000,
        });
      
        toastCenter.open();
      }
      });
        
      }
      
    },
  },
});


//directly open boom gate submit btn
$$('#open').on('click', function (e) {


  e.preventDefault();
var value = $$("[name='reason-radio']:checked").val();
var auth = app.form.getFormData("auth");
var formData = new FormData();
formData.append("type",$$('#gate-type').val());
formData.append("reason",value);

app.dialog.preloader('Opening Boom gate...');

request.post("security_boomgatelog",{"Authorization":"JWT "+auth.token},formData, function(data){
  app.dialog.close();
console.log(data);
var toastCenter = app.toast.create({
    text: "Boomgate Open",
    position: 'center',
    closeTimeout: 2000,
  });

  toastCenter.open();

  
  app.popup.close();
request.getimg("http://192.168.0.107/boomgate.php",null, function(data){
  console.log(data);
  });

 });
});









//*set mobile backpress function /////////////////////////////////////////////////////////////////////////////////////////////
function onBackKeyDown() {
 
  var leftp = app.panel.left && app.panel.left.opened;
  var rightp = app.panel.right && app.panel.right.opened;

  if ( leftp || rightp ) {

      app.panel.close();
      return false;
  }else if ($$('.modal-in').length > 0) {
    
   //   app.dialog.close();
      app.popup.close();
      return false;
  } else if (app.views.main.router.url == '/login/') {
 
      app.dialog.confirm('Are you want to exits?', function () {
        navigator.app.exitApp();
      });
  
    } else if (app.views.main.router.url == '/scanner/') {
        
      QRScanner.destroy(function(status){
        console.log(status);
      });
        app.views.main.router.navigate({name:"main"});
    
  
       
  
  } else if (app.views.main.router.url == '/main/') {
   
      app.dialog.confirm('Are you want to Logout?', function () {
        app.views.main.router.navigate({name:"login"});
        app.views.main.router.clearPreviousHistory();
        app.form.removeFormData('auth');
            });
    
       
  }  else {

    app.views.main.router.back();
 }
}

document.addEventListener("backbutton", onBackKeyDown, false);

// end ///////////////////////////////////////////////////////////////////////////////////////////////////////////////




$$(document).on('click',".cancel", function () {

  if (app.views.main.router.url == '/scanner/') {
 
    QRScanner.destroy(function(status){
      console.log(status);
    });
    
      app.views.main.router.navigate({name:"main"});
  }else{
    app.popup.close();
    
  }

  
  return false;
});


