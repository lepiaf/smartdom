import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { LivingroomPage } from '../livingroom/livingroom';
import { BedroomPage } from '../bedroom/bedroom';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = LivingroomPage;
  tab3Root: any = BedroomPage;

  constructor() {

  }
}
