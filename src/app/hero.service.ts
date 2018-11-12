import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
  	private http: HttpClient,
  	private messageService: MessageService) { }

  // GET heroes from the server
  getHeroes(): Observable<Hero[]> {
  	return this.http.get<Hero[]>(this.heroesUrl)
  		.pipe(
  			tap(_ => this.log('fetched heroes')),
  			catchError(this.handleError('getHeroes', []))
  		);
  }

  getHero(id: number): Observable<Hero> {
  	const url = `${this.heroesUrl}/${id}`;
  	return this.http.get<Hero>(url).pipe(
  		tap(_ => this.log(`fetched hero id=${id}`)),
  		catchError(this.handleError<Hero>(`getHero id=${id}`))
  	);
  }

  // PUT: update the hero on the server
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // POST: add a new hero to the server
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
     );
  }

  private handleError<T> (operation = 'operation', result?: T) {
  	return (error: any): Observable<T> => {
  		console.error(error);
  		this.log(`${operation} failed: ${error.message}`);
  		return of(result as T);
  	};
  }

  private log(message: string) {
  	this.messageService.add(`HeroService: ${message}`);
  }

}
