import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  baseUrl = 'https://localhost:7089/api/'
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(response => {
        const user: User = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.SetCurrentUser(user);
        }
      })
    );
  }

  register(model:any)
  {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => { 
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.SetCurrentUser(user);
          return user;
        }
        return null;
      })
        
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.SetCurrentUser(null)
  }

  SetCurrentUser(user:User | null)
  {
    this.currentUserSource.next(user);
  }

}