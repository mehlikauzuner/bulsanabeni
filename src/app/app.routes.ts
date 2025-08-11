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
import { Detay } from './components/pages/seyehat/kategoriler/cruise/detay/detay';
import { Ilan } from './components/pages/seyehat/kategoriler/cruise/ilan/ilan';
import { Fuarlar } from './components/pages/akademik/fuarlar/fuarlar';
import { Projeler } from './components/pages/akademik/projeler/projeler';
import { Speaking } from './components/pages/akademik/speaking/speaking';
import { Workshop } from './components/pages/akademik/workshop/workshop';
import { Yarismalar } from './components/pages/akademik/yarismalar/yarismalar';


export const routes: Routes = [
  { path: '', redirectTo: 'doga', pathMatch: 'full' },

  { path: 'doga', component: Doga },
  { path: 'akademik', component: Akademik },
  { path: 'eglence', component: Eglence },
  { path: 'sanat', component: Sanat },
  
 // Seyehat ana sayfa (turuncu dropdown)
  { path: 'seyehat', component: Seyehat },

  // Seyehat alt sayfalar (kırmızı dropdown)
  { path: 'seyehat/cruise', component: Cruise },
  { path: 'seyehat/geziler', component: Geziler },
  { path: 'seyehat/kulturgezileri', component: Kulturgezileri },
  { path: 'seyehat/turlar', component: Turlar },
  { path: 'seyehat/yurtdisi', component: Yurtdisi },
  

 // cruise detay
  { path: 'seyehat/cruise/detay', component: Detay },
  { path: 'seyehat/cruise/ilan', component: Ilan },
  
 { path: 'akademik/fuarlar', component: Fuarlar },
  { path: 'akademik/projeler', component: Projeler },
  { path: 'akademik/speaking', component: Speaking },
  { path: 'akademik/workshop', component: Workshop},
  { path: 'akademik/yarismalar', component: Yarismalar },
  

  {
    path: 'sanat',
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