import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface KeyManagement {
  id: string;
  equipmentName: string;
  memberName: string;
  bookingDateTime: string;
  keyStatus: 'available' | 'issued' | 'returned';
  issuedBy?: string;
  issuedDateTime?: string;
  returnedDateTime?: string;
}

export interface KeyIssueRequest {
  issuedBy: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  bookingDateTime: string;
  notes?: string;
}

export interface KeyReturnRequest {
  returnedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeyManagementService implements OnDestroy {
  private apiUrl = 'http://localhost:3000/keys'; // Updated to match backend port
  private keysSubject = new BehaviorSubject<KeyManagement[]>([]);
  public keys$ = this.keysSubject.asObservable();
  private refreshInterval: any;

  constructor(private http: HttpClient) {
    this.loadKeys();
    // Refresh keys every 30 seconds to ensure data is up-to-date
    this.refreshInterval = setInterval(() => this.loadKeys(), 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private async loadKeys(): Promise<void> {
    try {
      console.log('Fetching keys from:', this.apiUrl);
      const response = await firstValueFrom(
        this.http.get<Array<KeyManagement>>(this.apiUrl)
      );
      
      console.log('Raw API response:', response);
      
      if (!Array.isArray(response)) {
        console.error('Expected an array of keys but got:', response);
        throw new Error('Invalid response format: Expected an array of keys');
      }
      
      // Sort keys by equipment name
      const sortedKeys = response.sort((a, b) => {
        return a.equipmentName.localeCompare(b.equipmentName);
      });
      
      console.log('Processed and sorted keys:', sortedKeys);
      this.keysSubject.next(sortedKeys);
    } catch (error) {
      console.error('Error loading keys:', error);
      // Don't clear existing data on error, just log it
      if (this.keysSubject.value.length === 0) {
        this.keysSubject.next([]);
      }
    }
  }

  getAllKeys(): KeyManagement[] {
    return this.keysSubject.value;
  }

  async getKeyById(id: string): Promise<KeyManagement> {
    return firstValueFrom(this.http.get<KeyManagement>(`${this.apiUrl}/${id}`));
  }

  async issueKey(keyId: string, issueRequest: KeyIssueRequest): Promise<KeyManagement> {
    try {
      console.log('Issuing key:', { keyId, issueRequest });

      const updatedKey = await firstValueFrom(
        this.http.post<KeyManagement>(`${this.apiUrl}/${keyId}/issue`, issueRequest).pipe(
          tap((response) => {
            console.log('Server response - key issued:', response);
            this.loadKeys(); // Refresh keys list
          })
        )
      );
      
      if (!updatedKey) {
        throw new Error('No key data returned from server');
      }
      return updatedKey;
      
    } catch (error: any) {
      console.error('Error issuing key:', error);
      
      if (error.status === 409) {
        throw new Error('This key is already issued. Please check status.');
      } else if (error.error?.message) {
        // Handle server-side validation errors
        throw new Error(error.error.message);
      } else if (error.message) {
        // Re-throw our custom messages
        throw error;
      } else {
        throw new Error('Failed to issue key. Please try again.');
      }
    }
  }

  async returnKey(keyId: string, returnedBy: string): Promise<KeyManagement> {
    try {
      console.log('Returning key:', { keyId, returnedBy });
      
      const returnRequest: KeyReturnRequest = {
        returnedBy
      };

      const updatedKey = await firstValueFrom(
        this.http.post<KeyManagement>(`${this.apiUrl}/${keyId}/return`, returnRequest).pipe(
          tap((response) => {
            console.log('Server response - key returned:', response);
            this.loadKeys(); // Refresh keys list
          })
        )
      );
      
      if (!updatedKey) {
        throw new Error('No key data returned from server');
      }
      return updatedKey;
      
    } catch (error: any) {
      console.error('Error returning key:', error);
      
      if (error.status === 409) {
        throw new Error('This key is already returned or was never issued.');
      } else if (error.error?.message) {
        // Handle server-side validation errors
        throw new Error(error.error.message);
      } else if (error.message) {
        // Re-throw our custom messages
        throw error;
      } else {
        throw new Error('Failed to return key. Please try again.');
      }
    }
  }

  getKeysByStatus(status: 'available' | 'issued' | 'returned'): KeyManagement[] {
    return this.keysSubject.value.filter(key => key.keyStatus === status);
  }

  getKeysByEquipment(equipmentName: string): KeyManagement[] {
    return this.keysSubject.value.filter(key => 
      key.equipmentName.toLowerCase().includes(equipmentName.toLowerCase())
    );
  }

  getKeysByMember(memberName: string): KeyManagement[] {
    return this.keysSubject.value.filter(key => 
      key.memberName.toLowerCase().includes(memberName.toLowerCase())
    );
  }

  async getStatistics(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/statistics`));
  }
}
