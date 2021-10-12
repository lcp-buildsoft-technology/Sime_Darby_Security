

import LoginPage from '../pages/Login.f7.html';
import MainPage from '../pages/Main_page.f7.html';
import EntryPage from '../pages/Entry.f7.html';
import ScannerPage from '../pages/scanner.f7.html';
import WALK_IN from '../pages/walk_in.f7.html';
import IMPROMTU from '../pages/Impromtu.f7.html';
import VISITOR from '../pages/Visitor.f7.html';
import CONTACT from '../pages/Contact.f7.html';
import HISTORY from '../pages/History.f7.html';
import HISTORYVISITOR from '../pages/HistoryVisitor.f7.html';
import GPS from '../pages/gps.f7.html';
import TOUR from '../pages/Tour.f7.html';
import TOUR_MAP from '../pages/Tour_map.f7.html';
import TOUR_OPTION from '../pages/Tour_option.f7.html';
import TOUR_LOG from '../pages/Tour_log_details.f7.html';

import SCAN_ENTRY from '../pages/scanned_entry.f7.html';

var routes = [  
  
  { name: "login",
    path: '/login/',
    component: LoginPage,
  },
  { name: "gps",
    path: '/gps/',
    component: GPS,
  },
  { name: "tour",
  path: '/tour/',
  component: TOUR,
  }, 
  { name: "tour_log",
  path: '/tour_log/',
  component: TOUR_LOG,
  }, 
  { name: "tour_option",
  path: '/tour_option/',
  component: TOUR_OPTION,
  }, 
  { name: "tour_map",
  path: '/tour_map/',
  component: TOUR_MAP,
  },

  { name: "impromtu",
  path: '/impromtu/',
  component: IMPROMTU,
  },
  { name: "scan_entry",
  path: '/scan_entry/',
  component: SCAN_ENTRY,
  },
  { name: "main",
    path: '/main/',
    component: MainPage,
  },
  { name: "history",
    path: '/history/',
    component: HISTORY,
  },
  { name: "historyvisit",
    path: '/historyvisit/',
    component: HISTORYVISITOR,
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