import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cube-front'
  isSideNavOpen = false

  handleSideNav(isSideNavOpen: boolean){
    this.isSideNavOpen = isSideNavOpen
  }
}
