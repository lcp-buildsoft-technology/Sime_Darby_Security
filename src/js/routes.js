

import LoginPage from '../pages/Login.f7.html';
import MainPage from '../pages/Main_page.f7.html';
import EntryPage from '../pages/Entry.f7.html';
import ScannerPage from '../pages/scanner.f7.html';
import WALK_IN from '../pages/walk_in.f7.html';
import IMPROMTU from '../pages/Impromtu.f7.html';
import VISITOR from '../pages/Visitor.f7.html';
import CONTACT from '../pages/Contact.f7.html';
import HISTORY from '../pages/History.f7.html';
import CAMERA_TEST from '../pages/camera_test.f7.html';



var routes = [
  
  { name: "login",
    path: '/login/',
    component: LoginPage,
  },
  { name: "camera_test",
  path: '/camera_test/',
  component: CAMERA_TEST,
  },
  { name: "impromtu",
  path: '/impromtu/',
  component: IMPROMTU,
  },
  { name: "main",
    path: '/main/',
    component: MainPage,
  },
  { name: "history",
    path: '/history/',
    component: HISTORY,
  },
  {
    name: "walkin",
    path: '/walkin/',
    component: WALK_IN,
  },
  {
    name: "contact",
    path: '/contact/',
    component: CONTACT,
  },
  {
    name: "visitor",
    path: '/visitor/',
    component: VISITOR,
  },
  { name: "entry",
  path: '/entry/',
  component: EntryPage,
},

  
  {name: "scanner",
    path: '/scanner/',
    component: ScannerPage,
  },

 
,
];

export default routes;