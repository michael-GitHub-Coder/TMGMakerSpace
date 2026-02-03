import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Application {
  name: string;
  surname: string;
  email: string;
  phone: string;
  documents?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:3000/memberships/apply';

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

    documents.forEach(file => {
      formData.append('documents', file);
    });

    return firstValueFrom(
      this.http.post<Application>(this.apiUrl, formData)
    );
  }
}
