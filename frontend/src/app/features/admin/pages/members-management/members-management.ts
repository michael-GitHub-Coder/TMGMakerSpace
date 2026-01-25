import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../../shared/footer/footer';
import { HeaderComponent } from '../../../../shared/header/header';

interface Member {
  id: number;
  name: string;
  email: string;
  joinedAt: string;
}

@Component({
  selector: 'app-members-management',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './members-management.html',
})
export class MembersManagement implements OnInit {
  members: Member[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.members = JSON.parse(localStorage.getItem('members') || '[]');
  }

  editMember(id: number) {
    this.router.navigate([`/admin/members/edit/${id}`]);
  }

  deleteMember(id: number) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.members = this.members.filter(m => m.id !== id);
      localStorage.setItem('members', JSON.stringify(this.members));
    }
  }
}


