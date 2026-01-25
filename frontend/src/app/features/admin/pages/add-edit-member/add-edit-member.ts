import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';

interface Member {
  id: number;
  name: string;
  image?: string;
  badges?: string[];
  description?: string;
  links?: { url: string; icon: string }[];
  joinedAt: string;
}

@Component({
  selector: 'app-add-edit-member',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './add-edit-member.html',
  styleUrls: ['./add-edit-member.css']
})
export class AddEditMemberComponent implements OnInit {
  member: any = {
    id: Date.now(),
    name: '',
    image: '',
    badges: '',
    description: '',
    links: '',
    joinedAt: new Date().toISOString(),
  };

  isEditMode = false;

  constructor(private route: ActivatedRoute, private router: Router) {}
ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.isEditMode = true;
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const existing = members.find((m: Member) => m.id === Number(id));
    if (existing) {
      this.member = {
        ...existing,
        badges: existing.badges?.join(', ') || '',
        links: existing.links?.map((link: { url: string; icon: string }) => link.url).join(', ') || '',
      };
    }
  }
}


  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.member.image = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveMember() {
    if (!this.member.name) {
      alert('Please enter the member name.');
      return;
    }

    const members = JSON.parse(localStorage.getItem('members') || '[]');

    const memberToSave: Member = {
      id: this.member.id,
      name: this.member.name,
      image: this.member.image,
      badges: (this.member.badges as string)
        ? (this.member.badges as string).split(',').map(b => b.trim())
        : [],
      description: this.member.description,
      links: (this.member.links as string)
        ? (this.member.links as string).split(',').map(link => ({ url: link.trim(), icon: 'bi bi-link' }))
        : [],
      joinedAt: this.member.joinedAt || new Date().toISOString()
    };

    if (this.isEditMode) {
      const index = members.findIndex((m: Member) => m.id === memberToSave.id);
      if (index !== -1) members[index] = memberToSave;
    } else {
      members.unshift(memberToSave);
    }

    localStorage.setItem('members', JSON.stringify(members));
    alert(`✅ Member ${this.isEditMode ? 'updated' : 'added'} successfully!`);
    this.router.navigate(['/admin/members-management']);
  }
}
