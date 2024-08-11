// for page navigation & to sort on leftbar
export const ROUTES = [
  {
    title: "About BikinProject",
    href: "bikin-project",
    items: [
      { title: "Introduction", href: "/introduction" },
      { title: "Changelog", href: "/change-log" },
    ],
  },
  {
    title: "Getting Started",
    href: "getting-started",
    items: [
      { title: "Installation", href: "/installation" },
    ],
  },
  {
    title: "Available Frameworks",
    href: "available-frameworks",
    items: [
      { title: "React.js", href: "/reactjs" },
      { title: "Next.js", href: "/nextjs" },
      { title: "Node.js", href: "/nodejs" },
    ],
  },
  {
    title: "Community",
    href: "community",
    items: [
      { title: "FAQ", href: "/faq" },
      { title: "Contribution Guide", href: "/contribution-guide" },
    ],
  }
];

export const page_routes = ROUTES.map(({ href, items }) => {
  return items.map((link) => {
    return {
      title: link.title,
      href: href + link.href,
    };
  });
}).flat();
