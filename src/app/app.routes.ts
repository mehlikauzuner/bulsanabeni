import { RouterModule, Routes } from '@angular/router';
import { Doga } from './components/pages/doga/doga';
import { Akademik } from './components/pages/akademik/akademik';
import { Eglence } from './components/pages/eglence/eglence';
import { Sanat } from './components/pages/sanat/sanat';
import { Seyehat } from './components/pages/seyehat/seyehat';
import { Bisiklet } from './components/pages/doga/kategoriler/bisiklet/bisiklet';
import { Dagcilik } from './components/pages/doga/kategoriler/dagcilik/dagcilik';
import { Kamp } from './components/pages/doga/kategoriler/kamp/kamp';
import { Trekking } from './components/pages/doga/kategoriler/trekking/trekking';
import { Yuzme } from './components/pages/doga/kategoriler/yuzme/yuzme';
import { DeclareFunctionStmt } from '@angular/compiler';
import { Dans } from './components/pages/eglence/kategoriler/dans/dans';
import { Fotograf } from './components/pages/eglence/kategoriler/fotograf/fotograf';
import { Muzik } from './components/pages/eglence/kategoriler/muzik/muzik';
import { Oyun } from './components/pages/eglence/kategoriler/oyun/oyun';
import { Sinema } from './components/pages/eglence/kategoriler/sinema/sinema';
import { NgModule } from '@angular/core';

export const routes: Routes = [
 { path: 'doga', component: Doga},
  { path: 'akademik', component: Akademik },
  { path: 'eglence', component: Eglence },
  { path: 'sanat', component: Sanat },
  { path: 'seyahat', component: Seyehat},
  { path: '', redirectTo: '/doga', pathMatch: 'full' },
  { path: 'doga/bisiklet', component: Bisiklet },
  { path: 'doga/dagcilik', component: Dagcilik },
  { path: 'doga/kamp', component: Kamp },
  { path: 'doga/trekking', component: Trekking },
  { path: 'doga/yuzme', component: Yuzme },
  { path: 'eglence/dans', component: Dans },
  { path: 'eglence/fotograf', component: Fotograf},
  { path: 'eglence/muzik', component: Muzik },
  { path: 'eglence/oyun', component: Oyun },
  { path: 'eglence/sinema', component: Sinema },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}