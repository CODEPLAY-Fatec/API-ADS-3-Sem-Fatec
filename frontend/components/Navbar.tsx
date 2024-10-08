"use client";
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/home/dashboards">Dashboards</Link>
        </li>
        <li>
          <Link href="/home/surveys">Surveys</Link>
        </li>
      </ul>
      <style jsx>{`
        nav {
          padding: 1rem;
          background-color: #333;
        }
        ul {
          list-style: none;
          display: flex;
          gap: 1rem;
        }
        li {
          color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
