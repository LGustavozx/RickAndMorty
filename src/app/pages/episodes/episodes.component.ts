import { Component, OnInit, HostListener } from '@angular/core';
import { RickMortyService } from '../../services/rick-morty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Episode } from 'src/app/interfaces/episode-model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: Episode[] = [];
  page = 1;
  searchTerm: string = '';
  loading = false;
  searchSubject: Subject<string> = new Subject();

  constructor(private rickMortyService: RickMortyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.episodes = []; // Reset episodes on new search
      this.page = 1; // Reset page on new search
      this.loadEpisodes();
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  loadEpisodes(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.rickMortyService.getEpisodes(this.page, this.searchTerm).subscribe(data => {
      if (this.page === 1) {
        this.episodes = data.results;
      } else {
        this.episodes = [...this.episodes, ...data.results];
      }
      this.loading = false;
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;

    if (pos >= max && !this.loading) {
      this.page++;
      this.loadEpisodes();
    }
  }
}
