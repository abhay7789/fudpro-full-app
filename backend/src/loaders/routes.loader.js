const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/user/user.routes');
const customerRoutes = require('../modules/user/customer.routes');
const orderRoutes = require('../modules/order/order.routes');
const vendorRoutes = require('../modules/vendor/vendor.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const mediaRoutes = require('../modules/media/media.routes');
const adminRoutes = require('../modules/admin/admin.routes');

const routesLoader = (app) => {
  const apiPrefix = '/api/v1';

  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/customers`, customerRoutes);
  app.use(`${apiPrefix}/orders`, orderRoutes);
  app.use(`${apiPrefix}/vendors`, vendorRoutes);
  app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
  app.use(`${apiPrefix}/media`, mediaRoutes);
  app.use(`${apiPrefix}/admin`, adminRoutes);

  return app;
};

module.exports = routesLoader;
