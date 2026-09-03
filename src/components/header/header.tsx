"use client";
import React from "react";
import { clsx } from "clsx";
import Logo from "./logo";
import styles from "./header.module.css";

const links = [
  {
    name: "Commerce Timeline",
    href: "#timeline",
  },
  {
    name: "Commerce Trends",
    href: "#",
  },
  {
    name: "Country Profiles",
    href: "#",
  },
  {
    name: "Investment Case",
    href: "#",
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen((it) => !it);
  };
  return (
    <header className={styles.header}>
      <div className={styles["header_container"]}>
        <Logo />

        <nav className={styles["header_container_nav"]}>
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={styles["header_container_nav_link"]}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className={styles["header_container-mobile"]}>
          <button
            className={clsx(styles["header_container-mobile_menu"], {
              [styles["header_container-mobile_menu-open"]]: menuOpen,
            })}
            aria-label="Toggle Navigation Menu"
            id="menubutton"
            aria-haspopup="true"
            aria-controls="menu2"
            aria-expanded="false"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav
            className={clsx(styles["header_container-mobile_nav"], {
              [styles["header_container-mobile_nav-open"]]: menuOpen,
            })}
            aria-labelledby="menubutton"
            role="menu"
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                role="menuitem"
                className={styles["header_container-mobile_nav_link"]}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
