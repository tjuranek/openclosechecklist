import {
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  UsersIcon
} from '@heroicons/react/16/solid';
import { Heading } from '~/components/heading';
import { MetaFunction } from '@remix-run/node';
import { Button } from '~/components/button';
import { Text } from '~/components/text';

export default function Locations() {
  return (
    <>
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <Heading>Locations</Heading>
          <Text className="max-w-4xl">
            The different geographical places that your employees operate in.
            Locations organize your checklists into groups.
          </Text>
        </div>

        <div className="mt-3 sm:ml-4 sm:mt-0">
          <Button color="green">
            <PlusIcon />
            Add a Location
          </Button>
        </div>
      </div>

      <ul role="list" className="divide-y divide-gray-100 mt-8">
        {people.map(person => (
          <li key={person.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="h-12 w-12 bg-blue-400 rounded-full flex items-center justify-center">
                <BuildingStorefrontIcon className="h-6 w-6 text-white" />
              </div>

              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  Nisswa
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  Last updated on 7/30/24
                </p>
              </div>
            </div>

            <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
              <div className="flex w-8 gap-x-2.5">
                <dt>
                  <span className="sr-only">Total checklists</span>
                  <ClipboardDocumentListIcon
                    aria-hidden={true}
                    className="h-6 w-6 text-gray-400"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">2</dd>
              </div>

              <div className="flex w-8 gap-x-2.5">
                <dt>
                  <span className="sr-only">Total managers</span>
                  <UsersIcon
                    aria-hidden={true}
                    className="h-6 w-6 text-gray-400"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">4</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

export const meta: MetaFunction = () => [
  {
    title: 'Locations'
  }
];

const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z'
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z'
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z'
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z'
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null
  }
];
