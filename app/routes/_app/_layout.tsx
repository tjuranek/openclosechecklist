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
import { json, Outlet, useLoaderData } from '@remix-run/react';
import { StackedLayout } from '~/components/stacked-layout';
import { getUserInitials } from '~/services/user/user.util';
import { withAuth } from '~/services/auth/auth.util';
import { Avatar } from '~/components/avatar';
import { Routes } from '~/constants/routes';

const navItems = [
  { label: 'Home', url: Routes.Home },
  { label: 'Checklists', url: Routes.Checklists },
  { label: 'Locations', url: Routes.Locations }
];

export const loader = withAuth(({ user }) => {
  return json({ user });
});

export default function Layout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Dropdown>
            <DropdownButton as={NavbarItem} className="max-lg:hidden">
              <Avatar initials="NC" />
              <NavbarLabel>Nisswa Courtyard</NavbarLabel>
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

function CompanyDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/teams/1/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>

      <DropdownDivider />

      <DropdownItem href="/teams/2">
        <Avatar slot="icon" initials="RP" />
        <DropdownLabel>Rafferty's Pizza</DropdownLabel>
      </DropdownItem>

      <DropdownDivider />

      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>New team</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}
