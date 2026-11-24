// App-local paths stay on the current origin in both standalone and integrated builds.
export function appUrl(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const base = import.meta.env.BASE_URL;
  const [path] = href.split(/[?#]/);
  const suffix = href.slice(path.length);
  const local = base !== "/" && path.startsWith(base) ? path : base + path.slice(1);
  return (local.endsWith("/") || /\.[^/]+$/.test(local) ? local : local + "/") + suffix;
}

export function appPath(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const local = base && (pathname === base || pathname.startsWith(base + "/")) ? pathname.slice(base.length) : pathname;
  return local.replace(/\/$/, "") || "/";
}
