const bcrypt = require('bcryptjs');
const Role = require('../modules/role/role.model');
const User = require('../modules/user/user.model');
const Vendor = require('../modules/vendor/vendor.model');
const Category = require('../modules/category/category.model');
const MenuItem = require('../modules/menu/menuItem.model');

const runSeeds = async () => {
  console.log('Running seeds...');

  try {
    // 1. Roles
    const roles = ['SUPER_ADMIN', 'ADMIN', 'VENDOR', 'USER'];
    const roleMap = {};
    for (const roleName of roles) {
      const [role] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: { description: `${roleName} Role` }
      });
      roleMap[roleName] = role.id;
    }
    console.log('Roles seeded.');

    // 2. Categories
    const categories = ['BREAKFAST', 'LUNCH', 'DINNER'];
    const catMap = {};
    for (const catName of categories) {
      const [cat] = await Category.findOrCreate({
        where: { name: catName }
      });
      catMap[catName] = cat.id;
    }
    console.log('Categories seeded.');

    // 3. Super Admin
    const superAdminEmail = 'superadmin@fudpro.com';
    const [superAdmin, superAdminCreated] = await User.findOrCreate({
      where: { email: superAdminEmail },
      defaults: {
        name: 'Super Admin',
        phone: '7011338726',
        password: await bcrypt.hash('superadmin123', 10),
        roleId: roleMap['SUPER_ADMIN']
      }
    });

    // 4. Admin
    const adminEmail = 'admin@fudpro.com';
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Admin User',
        phone: '9821439650',
        password: await bcrypt.hash('admin@123', 10),
        roleId: roleMap['ADMIN']
      }
    });

    console.log('Admin accounts seeded successfully. Mock vendors and customers removed per cleanup policy.');

  } catch (error) {
    console.error('Error running seeds:', error);
  }
};

module.exports = runSeeds;
