import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';

interface Member {
  name: string;
  image?: string;
  badges?: string[];
  description?: string;
  links?: { url: string; icon: string }[];
  joinedAt: string;
}

interface BlogPost {
  title: string;
  subtitle: string;
  description: string;
  dateTime: string;
}

interface Admin {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  role: string | null = null;

  members: Member[] = [];
  blogs: BlogPost[] = [];
  admins: Admin[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');

    // Load Members (newest first)
    const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    this.members = savedMembers.reverse();

    // Load Blogs (newest first)
    const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    this.blogs = savedBlogs.reverse();

    // Load Admins
    const savedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    this.admins = savedAdmins;
  }

  // ----- Members -----
  removeMember(index: number) {
    if (confirm(`Delete member "${this.members[index].name}"?`)) {
      this.members.splice(index, 1);
      localStorage.setItem('members', JSON.stringify(this.members.reverse()));
    }
  }

  editMember(index: number) {
    const member = this.members[index];
    localStorage.setItem('editMember', JSON.stringify(member));
    this.members.splice(index, 1);
    localStorage.setItem('members', JSON.stringify(this.members.reverse()));
    this.router.navigate(['/admin/members']);
  }

  // ----- Blogs -----
  removeBlog(index: number) {
    if (confirm(`Delete blog "${this.blogs[index].title}"?`)) {
      this.blogs.splice(index, 1);
      localStorage.setItem('blogs', JSON.stringify(this.blogs.reverse()));
    }
  }

  editBlog(index: number) {
    const blog = this.blogs[index];
    localStorage.setItem('editBlog', JSON.stringify(blog));
    this.blogs.splice(index, 1);
    localStorage.setItem('blogs', JSON.stringify(this.blogs.reverse()));
    this.router.navigate(['/admin/blogs']);
  }

  // ----- Admins -----
  deleteAdmin(index: number) {
    if (confirm(`Delete admin "${this.admins[index].name}"?`)) {
      this.admins.splice(index, 1);
      localStorage.setItem('admins', JSON.stringify(this.admins));
    }
  }
}
