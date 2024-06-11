import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

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
        return this.handleError<any>('getCharacters', { results: [] })(error);
      })
    );
  }

  getCharacter(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`).pipe(
      catchError(this.handleError<any>('getCharacter'))
    );
  }

  getEpisodes(page: number, searchTerm: string = ''): Observable<any> {
    const url = `${this.apiUrl}/episode?page=${page}${searchTerm ? `&name=${searchTerm}` : ''}`;
    return this.http.get(url).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of({ results: [] });
        }
        return this.handleError<any>('getEpisodes', { results: [] })(error);
      })
    );
  }

  getAllEpisodes(searchTerm: string = ''): Observable<any[]> {
    const url = `${this.apiUrl}/episode${searchTerm ? `?name=${searchTerm}` : ''}`;
    return this.http.get(url).pipe(
      mergeMap((data: any) => {
        const pages = data.info.pages;
        const requests = [];
        for (let i = 1; i <= pages; i++) {
          requests.push(this.getEpisodes(i, searchTerm));
        }
        return forkJoin(requests).pipe(
          map(responses => responses.reduce((acc, curr) => acc.concat(curr.results), []))
        );
      }),
      catchError(this.handleError<any>('getAllEpisodes', []))
    );
  }

  getEpisode(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode/${id}`).pipe(
      catchError(this.handleError<any>('getEpisode'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
