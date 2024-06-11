import { Component, OnInit } from '@angular/core';
import { RickMortyService } from '../../services/rick-morty.service';
import { ActivatedRoute } from '@angular/router';
import { Episode } from 'src/app/interfaces/episode-model';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: Episode[] = [];
  page = 1;
  searchTerm: string = '';

  constructor(private rickMortyService: RickMortyService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.loadEpisodes();
    });
  }

  loadEpisodes(): void {
    this.rickMortyService.getEpisodes(this.page).subscribe(data => {
      this.episodes = data.results.filter((episode: Episode) =>
        episode.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    });
  }

  onScroll(): void {
    this.page++;
    this.loadEpisodes();
  }
}
