import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface MarketplaceItem {
  id?: string;
  title: string;
  description: string;
  cost: number;
  image?: string;
  memberEmail: string;
  memberName: string;
  createdAt?: Date;
  isActive: boolean;
}

export interface Enquiry {
  itemId: string;
  itemName: string;
  memberEmail: string;
  memberName: string;
  enquiryMessage: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = 'http://localhost:3000/api/marketplace'; // Adjust this URL based on your backend

  constructor(private http: HttpClient) {}

  // Get all marketplace items
  getMarketplaceItems(): Observable<MarketplaceItem[]> {
    return this.http.get<MarketplaceItem[]>(`${this.apiUrl}/items`);
  }

  // Get marketplace items by member
  getMemberMarketplaceItems(memberEmail: string): Observable<MarketplaceItem[]> {
    return this.http.get<MarketplaceItem[]>(`${this.apiUrl}/items/member/${memberEmail}`);
  }

  // Create new marketplace item
  createMarketplaceItem(item: Omit<MarketplaceItem, 'id' | 'createdAt'>): Observable<MarketplaceItem> {
    return this.http.post<MarketplaceItem>(`${this.apiUrl}/items`, item);
  }

  // Update marketplace item
  updateMarketplaceItem(id: string, item: Partial<MarketplaceItem>): Observable<MarketplaceItem> {
    return this.http.put<MarketplaceItem>(`${this.apiUrl}/items/${id}`, item);
  }

  // Delete marketplace item
  deleteMarketplaceItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  // Send enquiry
  sendEnquiry(enquiry: Omit<Enquiry, 'createdAt'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/enquiry`, enquiry);
  }

  // Upload image
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData);
  }
}
