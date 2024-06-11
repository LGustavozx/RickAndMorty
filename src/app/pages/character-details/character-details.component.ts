import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
})
export class CharacterDetailsComponent implements OnInit {
  character: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rickMortyService: RickMortyService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.rickMortyService.getCharacter(id).subscribe((data) => {
        this.character = data;
      });
    } else {
      console.error('Character ID is missing in the route');
    }
  }
}
