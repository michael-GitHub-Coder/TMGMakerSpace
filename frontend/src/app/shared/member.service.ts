import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Member {
  name: string;
  image: string;
  badges: string[];
  description: string;
  links: { url: string; icon: string }[];
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  // Observable member list
  private membersSource = new BehaviorSubject<Member[]>([]);
  members$ = this.membersSource.asObservable();

  // Get current value
  getMembers(): Member[] {
    return this.membersSource.getValue();
  }

  // Add a new member
  addMember(member: Member) {
    const updated = [...this.membersSource.getValue(), member];
    this.membersSource.next(updated);
  }

  // Remove a member
  removeMember(index: number) {
    const updated = this.membersSource.getValue();
    updated.splice(index, 1);
    this.membersSource.next([...updated]);
  }
}
