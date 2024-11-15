import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {}

  public route$: Observable<string> = this.router.events.pipe(
    filter((route) => route instanceof NavigationEnd),
    map((res: any) => res.url)
  );
}
