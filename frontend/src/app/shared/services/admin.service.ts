import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admins'; // replace with backend URL

  constructor(private http: HttpClient) {}

  createAdmin(adminData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, adminData);
  }

  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
