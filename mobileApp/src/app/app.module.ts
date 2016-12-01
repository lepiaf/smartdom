import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LivingroomPage } from '../pages/livingroom/livingroom';
import { BedroomPage } from '../pages/bedroom/bedroom';
import { BboxPage } from '../pages/bbox/bbox';
import { HdmiPage } from '../pages/hdmi/hdmi';
import { TabsPage } from '../pages/tabs/tabs';
import { TvPage } from '../pages/tv/tv';
import { LedPage } from '../pages/led/led';
import { ApiProvider } from '../providers/api-provider';
import { HeaterProvider } from '../providers/heater-provider';
import { RoomProvider } from '../providers/room-provider';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LivingroomPage,
    BedroomPage,
    BboxPage,
    HdmiPage,
    TvPage,
    LedPage,
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
    HdmiPage,
    TvPage,
    LedPage,
    TabsPage
  ],
  providers: [ApiProvider, HeaterProvider, RoomProvider]
})
export class AppModule {}
