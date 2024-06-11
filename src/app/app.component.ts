import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchTerm: string = '';
  showSearch: boolean = false;
  showBackButton: boolean = false;
  searchSubject: Subject<string> = new Subject();
  previousUrl: string | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.updateVisibility(url);
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(searchTerm: string): void {
    this.router.navigate([], {
      queryParams: { search: searchTerm.length >= 3 ? searchTerm : null },
      queryParamsHandling: 'merge'
    });
  }

  goBack(): void {
    if (this.previousUrl) {
      this.router.navigate([this.previousUrl], { queryParamsHandling: 'preserve' });
    }
  }

  private updateVisibility(url: string): void {
    this.showSearch = url.includes('/characters') || url.includes('/episodes');
    this.showBackButton = url.includes('/characters/') || url.includes('/episodes/');

    if (this.showBackButton) {
      this.previousUrl = url.includes('/characters/') ? '/characters' : '/episodes';
    }
  }
}
