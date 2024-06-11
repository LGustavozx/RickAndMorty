import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number, searchTerm: string = ''): Observable<any> {
    const url = `${this.apiUrl}/character?page=${page}${searchTerm ? `&name=${searchTerm}` : ''}`;
    return this.http.get(url).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of({ results: [] });
        }
        return this.handleError('getCharacters', [])(error);
      })
    );
  }

  getCharacter(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`).pipe(
      catchError(this.handleError('getCharacter'))
    );
  }

  getEpisodes(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode?page=${page}`).pipe(
      catchError(this.handleError('getEpisodes', []))
    );
  }

  getEpisode(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode/${id}`).pipe(
      catchError(this.handleError('getEpisode'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
