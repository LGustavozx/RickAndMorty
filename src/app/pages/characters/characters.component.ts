import { Component, OnInit, HostListener } from '@angular/core';
import { RickMortyService } from '../../services/rick-morty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from 'src/app/interfaces/character-model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  page = 1;
  searchTerm: string = '';
  loading = false;
  searchSubject: Subject<string> = new Subject();

  constructor(private rickMortyService: RickMortyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.characters = [];
      this.page = 1;
      this.loadCharacters();
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  loadCharacters(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.rickMortyService.getCharacters(this.page, this.searchTerm).subscribe(data => {
      if (this.page === 1) {
        this.characters = data.results;
      } else {
        this.characters = [...this.characters, ...data.results];
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
      this.loadCharacters();
    }
  }
}
