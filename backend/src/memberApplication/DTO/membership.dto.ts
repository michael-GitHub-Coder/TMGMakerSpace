export class CreateMembershipDto {
  name: string;
  surname: string;
  email: string;
  phone: string;
  documents: string[]; 
}

export class UpdateMembershipDto {
  status?: 'approved' | 'rejected' | 'more_info_required';
  adminComment?: string;
}
