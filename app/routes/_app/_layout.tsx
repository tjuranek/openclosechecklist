import { json, Outlet } from '@remix-run/react';
import { Navbar, NavbarItem, NavbarSection } from '~/components/navbar';
import { Sidebar, SidebarBody, SidebarItem, SidebarSection } from '~/components/sidebar';
import { StackedLayout } from '~/components/stacked-layout';
import { withAuth } from '~/services/auth/auth.util';

enum Routes {
  Dashboard = '/dashboard',
  Locations = '/locations'
}

const navItems = [
  { label: 'Dashboard', url: Routes.Dashboard },
  { label: 'Locations', url: Routes.Locations }
];

export const loader = withAuth(({ user }) => {
  return json({ user });
});

export default function Layout() {
  return (
    <StackedLayout
      navbar={
        <NavbarSection className="max-lg:hidden">
          {navItems.map(({ label, url }) => (
            <NavbarItem key={label} href={url}>
              {label}
            </NavbarItem>
          ))}
        </NavbarSection>
      }
      sidebar={
        <Sidebar>
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
