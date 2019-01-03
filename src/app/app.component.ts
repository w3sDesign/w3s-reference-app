// <app-root>
//   ######## Toolbar ...
//   <router-outlet>

//       <app-customer-root>
//         ########## CUSTOMER ...
//         <router-outlet>

//           <app-customer-list>
//               ######### CUSTOMER Data Table ...
//           </app-customer-list>

//         </router-outlet>
//       </app-customer-root>

//   </router-outlet>
// </app-root>


import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'w3sDesign';
  navEnd: Observable<NavigationEnd>;
  openSideNav = false; // TODO

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    // Create a new Observable that publishes only the NavigationEnd event.
    this.navEnd = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
  }



  ngOnInit() {
    console.log('test');
    console.log(this.router.url); // /

    this.activatedRoute.url
      .subscribe(url => console.log('url changed to: ' + url));

    this.navEnd.subscribe(event => {
      console.log('navigation end = ' + event.url);
      this.openSideNav = !(event.url === '/home' || event.url === '/');
    });

    console.log('router.url = ' + this.router.url); // /

    // this.activatedRoute.url.pipe(
    //   map(segments => segments.join(''))
    // )
    //   .subscribe(url2 => console.log('url = ' + url2));

    // const url: Observable<string> = this.route.url.map(segments => segments.join(''));
    // url.subscribe(url2 => console.log(url2));
  }

}
