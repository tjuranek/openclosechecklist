import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon
} from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { LocationService } from '~/services/location/location.service';
import { Heading, Subheading } from '~/components/heading';
import { withAuth } from '~/services/auth/auth.util';
import { json, MetaFunction } from '@remix-run/node';
import { getRequiredParam } from '~/utils/params';
import { useLoaderData } from '@remix-run/react';
import { Input } from '~/components/input';

export const loader = withAuth(async ({ params }) => {
  const locationId = getRequiredParam(params, 'locationId') as string;
  const location = await LocationService.getLocationById(locationId);

  return json({ location });
});

export default function LocationsLocation() {
  const { location } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <Heading>{location.name}</Heading>
          <Subheading>
            Last edited on{' '}
            {new Date(location.updatedAt).toLocaleDateString('en-us', {
              dateStyle: 'long'
            })}
          </Subheading>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-8">
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow col-span-2">
          <div className="px-4 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The basic details. Visible to any managers or employees of this
              location.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p>test</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Managers
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              They can manage the checklists and get reports.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p>test</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow col-span-3">
          <div className="px-4 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Checklists
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Wouldn't need these if your employees were as passionate as you
              are.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p>test</p>
          </div>
        </div>
      </div>
    </>
  );
}

export const meta: MetaFunction = () => [
  {
    title: 'Location Details'
  }
];
