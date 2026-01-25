import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';



@Component({
  selector: 'app-services',
  imports: [CommonModule, HeaderComponent, FooterComponent, BannerComponent],
  templateUrl: './members.html',
})
export class MembersComponent {
  members = [
    {
      name: 'Mpho Robotics',
      image: './images/members/mpho-robotics.png',
      badges: ['Robotics', 'Electronics', '3D Printing'],
      description: `MphoRobotics in Johannesburg offers professional, affordable 3D printing and laser cutting with fast turnaround. Services include prototyping, manufacturing, and training. High-quality results and shipping options available.`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://mphorobotics.co.za/' },
        { icon: 'bi bi-instagram', url: 'https://www.instagram.com/mr_robot_maker/?hl=en' }
      ]
    },
    {
      name: 'Imvelaphi Tech',
      image: './images/members/imvelaphi.png',
      badges: ['Electronics', 'Laser Cutting', 'Design'],
      description: `Imvelaphi Tech crafts bespoke Bluetooth speakers shaped like African calabash pots, blending science, technology, and cultural heritage.`,
      links: [
        { icon: 'bi bi-instagram', url: 'https://www.instagram.com/imvelaphi_design/' },
        { icon: 'bi bi-facebook', url: 'https://m.facebook.com/imvelaphitech' }
      ]
    },
    {
      name: 'Olround Tech',
      image: './images/members/olround-tech.png',
      badges: ['IoT', 'Electronics', 'Robotics'],
      description: `Olround Tech leverages electronics, software, and emerging technology to solve industry problems and drive innovation.`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://olroundtech.co.za/' },
        { icon: 'bi bi-linkedin', url: 'https://za.linkedin.com/company/olround-tech' },
        { icon: 'bi bi-facebook', url: 'https://www.facebook.com/olroundtech/' },
        { icon: 'bi bi-youtube', url: 'https://www.youtube.com/channel/UCtBI46cEt-duHJpBd8baatw' }
      ]
    },
    {
      name: 'Tiye Technologies',
      image: './images/members/tiye-technologies.png ',
      badges: ['AI', 'Software Development', 'Robotics'],
      description: `Tiye is a custom software development company, transforming ideas into functional solutions. Their tailored approach delivers high-quality, personalized software to meet customer needs.`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://tiye-technologies.web.app/' },
      ]
    },
    {
      name: 'Reacoda',
      image: './images/members/Reacoda.png',
      badges: ['Programming', 'Electronics', 'Robotics'],
      description: `Reacoda is a startup specializing in skills development and technical consultation.
            We create custom curriculums in design thinking, electronics, and robotics. 
            We design hardware projects and developed Molemi Personal Food Computer for indoor growing.`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://reacoda.co.za' },
        { icon: 'bi bi-instagram', url: 'https://www.instagram.com/reacoda/' },
        { icon: 'bi bi-facebook', url: 'https://www.facebook.com/reacoda/' }
      ]
    },
    {
      name: 'Bluemachines',
      image: './images/members/Bluemachines.png',
      badges: ['AI', 'Software Development', 'Robotics'],
      description: `Bluemachines develops ML-enabled software solutions, focusing on mobile payment apps for African SMBs and underbanked. Expertise spans AI, mobile apps, and cloud deployment, including mentorship on ML integration. Past projects include NLP and data automation.`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://bluemachines.co.za/' }
      ]
    },
    {
      name: 'AUKODesigns',
      image: './images/members/auko designs.png',
      badges: ['Industrial Design', '3D Design', 'Laser Cutting'],
      description: `AUKODesigns is 3D Design solutions company that specializes in Industrial & Architectural Design Softwares, 3D Education & Manufacturing Technologies`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://www.aukodesigns.co.za/' },
        { icon: 'bi bi-linkedin', url: 'http://linkedin-www.linkedin.com/in/' },
        { icon: 'bi bi-facebook', url: 'https://www.facebook.com/reel/1626618868108887' },
        { icon: 'bi bi-tiktok', url: 'https://www.tiktok.com/@aukodesigns?_t=8lXzVjnZhqf&_r=1'},
        { icon: 'bi bi-instagram', url: 'https://www.instagram.com/aukodesigns?igsh=MXE1ancxZjY2bHQyNg==' },
        
      ]
    },
    {
      name: 'Neosentle',
      image: './images/members/Neosentle.jpg',
      badges: ['3D Printing', 'Art', '3D Modeling'],
      description: `Neotsentle, led by Nthati Machesa, blends traditional and digital art. Specializing in 3D art, teaching, and storytelling.`,
      links: [
        { icon: 'bi bi-tiktok', url: 'https://www.tiktok.com/@neotsentlesa/video/7248900178969677061'},
        { icon: 'bi bi-instagram', url: 'https://www.instagram.com/neotsentlesa/?hl=en' },
        { icon: 'bi bi-facebook', url: 'https://www.facebook.com/reel/1626618868108887' },
        
      ]
    },
    {
      name: 'Namane Images',
      image: './images/members/Namane Images.png',
      badges: ['Electronics', '3D Printing', 'Laser Cutting'],
      description: `Established in 2016, Namane Images offers affordable photography, 3D fabrication, laser cutting, and software development to individuals and businesses globally.`,
      links: [
        { icon: 'bi bi-globe-europe-africa', url: 'https://namaneimages.my.canva.site/'},
        { icon: 'bi bi-linkedin', url: 'https://www.linkedin.com/in/neo-namane/' },
        { icon: 'bi bi-facebook', url: 'https://www.facebook.com/nechnotick' },
        { icon: 'bi bi-twitter', url: 'https://twitter.com/nechnotick'},
        { icon: 'bi bi-instagram', url: 'https://www.instagram.com/nechnotick/'},
        { icon: 'bi bi-medium', url: 'https://medium.com/@nechnotick'},
        { icon: 'bi bi-tiktok', url: 'https://www.tiktok.com/@namaneimages'}
        
      ]
    },
    {
      name: 'Absolute Techo',
      image: './images/members/Absolute_Techno.png',
      badges: ['Electronics', 'Drones', 'Laser Cutting'],
      description: `Absolute Techno turns clients' ideas into reality, providing services from CAD design and 3D printing to laser cutting and commercial catering repairs. They offer comprehensive solutions to meet diverse needs across various industries.`,
      links: [
        { icon: 'bi bi-tiktok', url: ''},
        { icon: 'bi bi-instagram', url: '' },
        { icon: 'bi bi-facebook', url: '' },
        
      ]
    },
    {
      name: 'Iota Microsystems',
      image: './images/members/Iota.png',
      badges: ['Electronics', 'Drones', 'Laser Cutting'],
      description: `Absolute Techno turns clients' ideas into reality, providing services from CAD design and 3D printing to laser cutting and commercial catering repairs. They offer comprehensive solutions to meet diverse needs across various industries.`,
      links: [
        { icon: 'bi bi-tiktok', url: ''},
        { icon: 'bi bi-instagram', url: '' },
        { icon: 'bi bi-facebook', url: '' },
        
      ]
    },

  ];
}