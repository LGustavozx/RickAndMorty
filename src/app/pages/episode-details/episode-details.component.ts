import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episode: any;
  characterNames: { [key: string]: string } = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private rickMortyService: RickMortyService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.rickMortyService.getEpisode(id).subscribe(
        data => {
          this.episode = data;
          this.loadCharacterNames();
        },
        error => {
          console.error('Error fetching episode:', error);
        }
      );
    } else {
      console.error('Episode ID is missing in the route');
    }
  }

  getCharacterId(url: string): number {
    const parts = url.split('/');
    return +parts[parts.length - 1];
  }

  loadCharacterNames(): void {
    if (this.episode && this.episode.characters) {
      this.episode.characters.forEach((characterUrl: string) => {
        const characterId = this.getCharacterId(characterUrl);
        this.rickMortyService.getCharacter(characterId).subscribe(
          data => {
            this.characterNames[characterUrl] = data.name;
          },
          error => {
            console.error('Error fetching character:', error);
          }
        );
      });
    }
  }

  getCharacterName(url: string): string {
    return this.characterNames[url] || 'Loading...';
  }
}
