import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { catchError, Observable, throwError, from, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { UserDTO } from '../model/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient, private auth: Auth) { }
  getUser() {
    throw new Error('Method not implemented.');
  }

  createUser(userDto: UserDTO): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, userDto.email, userDto.password)).pipe(
      switchMap(() => this.http.post<User>(this.apiUrl + `usuario`, userDto)),
      catchError(error => {
        console.error('Erro ao criar usuário no Firebase ou backend:', error);
        throw error;
      })
    );
  }

  loginUser(email: string, senha: string): Observable<number> {
    return from(signInWithEmailAndPassword(this.auth, email, senha)).pipe(
      switchMap(() => this.http.get<number>(`${this.apiUrl}usuario/${email}`)),
      catchError((error) => {
        console.error('Erro no login Firebase ou no backend:', error);
        return of(0);
      })
    );
  }
}
