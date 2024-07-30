import { Company } from '@prisma/client';

export function getCompanyInitials(company: Pick<Company, 'name'>) {
  return company.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}
