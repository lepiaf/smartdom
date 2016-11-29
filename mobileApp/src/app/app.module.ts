import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LivingroomPage } from '../pages/livingroom/livingroom';
import { BedroomPage } from '../pages/bedroom/bedroom';
import { BboxPage } from '../pages/bbox/bbox';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LivingroomPage,
    BedroomPage,
    BboxPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LivingroomPage,
    BedroomPage,
    BboxPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
