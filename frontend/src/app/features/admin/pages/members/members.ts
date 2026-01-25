import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';

interface Member {
  id: number; // unique ID
  name: string;
  image?: string;
  badges?: string[];
  description?: string;
  links?: { url: string; icon: string }[];
  joinedAt: string;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './members.html',
  styleUrls: ['./members.css']
})
export class MembersComponent {
  members: Member[] = [];
  newMember: any = { id: 0, name: '', image: '', badges: '', description: '', links: '' };

  constructor(private router: Router) {
    // Load existing members from localStorage
    this.members = JSON.parse(localStorage.getItem('members') || '[]');
  }

  // Handle image upload
  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.newMember.image = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Add new member
  addMember() {
    if (!this.newMember.name) {
      alert('Please enter the member name.');
      return;
    }

    const member: Member = {
      id: Date.now(), // unique ID
      name: this.newMember.name,
      image: this.newMember.image,
      badges: this.newMember.badges
        ? this.newMember.badges.split(',').map((b: string) => b.trim())
        : [],
      description: this.newMember.description,
      links: this.newMember.links
        ? this.newMember.links.split(',').map((link: string) => ({ url: link.trim(), icon: 'bi bi-link' }))
        : [],
      joinedAt: new Date().toISOString()
    };

    // Save to localStorage at the top
    const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    savedMembers.unshift(member);
    localStorage.setItem('members', JSON.stringify(savedMembers));

    alert(`✅ Member "${member.name}" added successfully!`);

    // Reset form
    this.newMember = { id: 0, name: '', image: '', badges: '', description: '', links: '' };

    // Navigate back to dashboard or stay
    this.router.navigate(['/admin/dashboard']);
  }
}
