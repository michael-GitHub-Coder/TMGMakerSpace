import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';

interface Service {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BannerComponent],
  templateUrl: './services.html'
})
export class ServicesComponent {
  services: Service[] = [
    {
      title: 'Makerspace Design and Setup',
      description: `
        TMG Makerspace is experienced in the design and set up of makerspaces and the 
        development and implementation of impactful makerspace programs. 
        With a proven track record in the field, we have successfully established and 
        operated the Tshimologong Makerspace for Wits Tshimologong Precinct since 2018 to date. Additionally, 
        we recently launched the Bafokeng RoboticsLab, a makerspace in Phokeng, 
        in collaboration with the Royal Bafokeng Nation Development Trust, to empower and serve the Bafokeng Nation.
      `,
      image: './images/Makerspace Design and Implementation Pic.png'
    },
    {
      title: 'Skills Development',
      description: `
        We regularly train and upskill the youth, especially previously disadvantaged youth, 
        in technologies such as 3D Printing, Laser Cutting, Internet of Things (IoT), 
        Robotics, and Artificial Intelligence (AI) using a non-intimidating and practical approach. 
        Participants attending our programmes are trained enough to be employable or build products that 
        solve our most pressing problems or can be commercialized. We also assist innovators formulate and refine their ideas by hosting Design Thinking and Prototyping Workshops.
      `,
      image: './images/Skills Development.jpg'
    },
    {
      title: 'Innovators Support',
      description: `
        We offer support to makers and innovators who build products using or in Internet of Things, 
        Artificial Intelligence, Robotics, and Digital Fabrication (CAD, 3D Printing and Laser Cutting), 
        another way we are enabling Africa to solve its problems. This is achieved by providing access to space, 
        equipment, materials, and a like-minded community to enable the building of Prototypes and 
        Minimum Viable Products.
      `,
      image: './images/Service_Product Development Support.jpg'
    },
    {
      title: 'Project Design and Implementation',
      description: `
        We design and implement projects in partnership with academic institutions, 
        corporate companies and government entities that lower barriers of entry to emerging (4IR) technologies, 
        provide market access to the technology startups, and enable innovation. 
        One such project is the annual City of Johannesburg (CoJ) Smart City Innovation Challenge, 
        a City of Johannesburg Smart City Office initiative in partnership with University of Witwatersrand 
        which aims to find and develop innovative solutions from startups, community groups, and CoJ employees within municipal departments and entities.
      `,
      image: './images/Project Design and implementation.jpg'
    }
  ];
}
