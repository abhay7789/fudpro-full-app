export const getDashboardRoute = (role) => {
  const routes = {
    SUPER_ADMIN: '/superadmin/dashboard',
    ADMIN: '/admin/dashboard',
    VENDOR: '/vendor/dashboard',
    USER: '/user/dashboard'
  };
  return routes[role] || '/';
};

export const isRouteProtected = (pathname) => {
  const protectedPaths = [
    '/superadmin/dashboard',
    '/admin/dashboard',
    '/vendor/dashboard',
    '/user/dashboard'
  ];
  return protectedPaths.some(path => pathname.startsWith(path));
};