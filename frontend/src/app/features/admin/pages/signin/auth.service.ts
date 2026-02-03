import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() {}

  setUser(user: any) {
    this.currentUser = user;
  }

  getUser() {
    return this.currentUser;
  }

//   logout() {
//     this.currentUser = null;
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }
}
