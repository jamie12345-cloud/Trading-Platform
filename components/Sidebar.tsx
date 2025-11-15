'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Reports', path: '/reports' },
  { name: 'Trades', path: '/trades' },
  { name: 'Journal', path: '/journal' },
  { name: 'New Trade', path: '/new-trade' },
  { name: 'Search', path: '/search' },
  { name: 'Import', path: '/import' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">MyTrade</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="sidebar-nav-item">
              <Link
                href={item.path}
                className={`sidebar-nav-link text-base font-medium ${
                  pathname === item.path ? 'active' : ''
                }`}               
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
