import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

export interface Application {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  documents?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:3000/memberships';

  constructor(private http: HttpClient) {}

  async createApplication(
    name: string,
    surname: string,
    email: string,
    phone: string,
    documents: File[] = []
  ): Promise<Application> {
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('surname', surname.trim());
    formData.append('email', email.trim().toLowerCase());
    formData.append('phone', phone.trim());

    documents.forEach(file => formData.append('documents', file));

    return firstValueFrom(
      this.http.post<Application>(`${this.apiUrl}/apply`, formData)
    );
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`);
  }

  approveApplication(id: number): Observable<any> {
    // Must match NestJS @Put('admin/memberships/:id/approve')
    return this.http.put(`http://localhost:3000/admin/memberships/${id}/approve`.trim(), {});
  }

  rejectApplication(id: number, reason: string): Observable<any> {
    // Must match NestJS @Put('admin/memberships/:id/reject')
    return this.http.put(`http://localhost:3000/admin/memberships/${id}/reject`.trim(), { reason });
  }
}
