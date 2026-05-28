export class CreateMarketplaceItemDto {
  title: string;
  description: string;
  cost: number;
  image?: string;
  memberEmail: string;
  memberName: string;
  isActive?: boolean = true;
}

