import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu
} from '~/components/dropdown';
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection
} from '~/components/sidebar';
import {
  Form,
  json,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSubmit
} from '@remix-run/react';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer
} from '~/components/navbar';
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  PlusIcon
} from '@heroicons/react/16/solid';
import { getCompanyInitials } from '~/services/company/company.util';
import { CompanyService } from '~/services/company/company.service';
import { replaceRouteParams, Routes } from '~/constants/routes';
import { StackedLayout } from '~/components/stacked-layout';
import { getUserInitials } from '~/services/user/user.util';
import { UserService } from '~/services/user/user.service';
import { withAuth } from '~/services/auth/auth.util';
import { Avatar } from '~/components/avatar';
import { Company } from '@prisma/client';

const navItems = [
  { label: 'Home', url: Routes.Home },
  { label: 'Checklists', url: Routes.Checklists },
  { label: 'Locations', url: Routes.Locations }
];

export const loader = withAuth(async ({ user, selectedCompanyId }) => {
  const accessibleCompanies = await UserService.getAccessibleCompanies(user.id);

  return json({ accessibleCompanies, selectedCompanyId, user });
});

export default function Layout() {
  const { accessibleCompanies, selectedCompanyId, user } =
    useLoaderData<typeof loader>();

  const selectedCompany = accessibleCompanies.find(
    ac => ac.id === selectedCompanyId
  );

  if (!selectedCompany) {
    throw new Error(
      'Company not found on user given selected company id in session.'
    );
  }

  const switchableCompanies = accessibleCompanies.filter(
    ac => ac.id !== selectedCompanyId
  );

  function CompanyDropdownMenu() {
    return (
      <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
        <DropdownItem
          href={replaceRouteParams(Routes.CompanySettings, {
            companyId: selectedCompanyId
          })}
        >
          <Cog8ToothIcon />
          <DropdownLabel>Settings</DropdownLabel>
        </DropdownItem>

        {switchableCompanies.length > 0 && (
          <>
            <DropdownDivider />

            {switchableCompanies.map(sc => (
              <DropdownItem
                key={sc.id}
                href={replaceRouteParams(Routes.ResourceSelectCompany, {
                  companyId: sc.id
                })}
              >
                <Avatar slot="icon" initials={getCompanyInitials(sc)} />
                <DropdownLabel>{sc.name}</DropdownLabel>
              </DropdownItem>
            ))}
          </>
        )}

        <DropdownDivider />

        <DropdownItem href="/teams/create">
          <PlusIcon />
          <DropdownLabel>New team</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    );
  }

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Dropdown>
            <DropdownButton as={NavbarItem} className="max-lg:hidden">
              <Avatar initials={getCompanyInitials(selectedCompany)} />
              <NavbarLabel>{selectedCompany.name}</NavbarLabel>
              <ChevronDownIcon />
            </DropdownButton>

            <CompanyDropdownMenu />
          </Dropdown>

          <NavbarDivider className="max-lg:hidden" />

          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => (
              <NavbarItem key={label} href={url}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>

          <NavbarSpacer />

          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar initials={getUserInitials(user)} square />
              </DropdownButton>

              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>

                <DropdownDivider />

                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar src="/tailwind-logo.svg" />
                <SidebarLabel>Tailwind Labs</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>

              <CompanyDropdownMenu />
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <Outlet />
    </StackedLayout>
  );
}
