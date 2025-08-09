import { Routes } from '@angular/router';

// Sayfalar
import { Doga } from './components/pages/doga/doga';
import { Akademik } from './components/pages/akademik/akademik';
import { Eglence } from './components/pages/eglence/eglence';
import { Sanat } from './components/pages/sanat/sanat';


// Doga alt
import { Bisiklet } from './components/pages/doga/kategoriler/bisiklet/bisiklet';
import { Dagcilik } from './components/pages/doga/kategoriler/dagcilik/dagcilik';
import { Kamp } from './components/pages/doga/kategoriler/kamp/kamp';
import { Trekking } from './components/pages/doga/kategoriler/trekking/trekking';
import { Yuzme } from './components/pages/doga/kategoriler/yuzme/yuzme';

// Eğlence alt
import { Dans } from './components/pages/eglence/kategoriler/dans/dans';
import { Fotograf } from './components/pages/eglence/kategoriler/fotograf/fotograf';
import { Muzik } from './components/pages/eglence/kategoriler/muzik/muzik';
import { Oyun } from './components/pages/eglence/kategoriler/oyun/oyun';
import { Sinema } from './components/pages/eglence/kategoriler/sinema/sinema';
import { Cruise } from './components/pages/seyehat/kategoriler/cruise/cruise';
import { Geziler } from './components/pages/seyehat/kategoriler/geziler/geziler';
import { Kulturgezileri } from './components/pages/seyehat/kategoriler/kulturgezileri/kulturgezileri';
import { Turlar } from './components/pages/seyehat/kategoriler/turlar/turlar';
import { Yurtdisi } from './components/pages/seyehat/kategoriler/yurtdisi/yurtdisi';
import { Seyehat } from './components/pages/seyehat/seyehat';
import { Enstruman } from './components/pages/sanat/kategoriler/enstruman/enstruman';
import { Halkoyunlari } from './components/pages/sanat/kategoriler/halkoyunlari/halkoyunlari';
import { Resim } from './components/pages/sanat/kategoriler/resim/resim';
import { Tasarim } from './components/pages/sanat/kategoriler/tasarim/tasarim';


export const routes: Routes = [
  { path: '', redirectTo: 'doga', pathMatch: 'full' },

  { path: 'doga', component: Doga },
  { path: 'akademik', component: Akademik },
  { path: 'eglence', component: Eglence },
  { path: 'sanat', component: Sanat },
  
  {
    path: 'seyehat',
    component: Seyehat,
    children: [
      { path: '', redirectTo: 'cruise', pathMatch: 'full' },
      { path: 'cruise', component: Cruise},
      { path: 'geziler', component: Geziler },
      { path: 'kulturgezileri', component: Kulturgezileri },
      { path: 'turlar', component: Turlar },
      { path: 'yurtdisi', component: Yurtdisi },
    ],
  },
  {
    path: 'seyehat',
    component: Sanat,
    children: [
      { path: '', redirectTo: 'sanat', pathMatch: 'full' },
      { path: 'dans', component: Dans},
      { path: 'enstruman', component: Enstruman },
      { path: 'halkoyunlari', component: Halkoyunlari },
      { path: 'resim', component: Resim },
      { path: 'tasarim', component: Tasarim },
    ],
  },
]