const db = require('../models');
const Users = db.users;

const HumanResources = db.human_resources;

const Inventory = db.inventory;

const Machinery = db.machinery;

const QualityControl = db.quality_control;

const RawMaterials = db.raw_materials;

const Suppliers = db.suppliers;

const WorkOrders = db.work_orders;

const Organizations = db.organizations;

const HumanResourcesData = [
  {
    employee_name: 'John Doe',

    role: 'Machine Operator',

    shift: 'Day',

    payroll: 4000,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Jane Smith',

    role: 'Quality Control Inspector',

    shift: 'Night',

    payroll: 4500,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Mike Johnson',

    role: 'Production Manager',

    shift: 'Day',

    payroll: 6000,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Emily Davis',

    role: 'HR Officer',

    shift: 'Day',

    payroll: 5000,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Sam Wilson',

    role: 'Maintenance Technician',

    shift: 'Night',

    payroll: 4200,

    // type code here for "relation_one" field
  },
];

const InventoryData = [
  {
    product_name: 'Widget A',

    quantity_available: 1500,

    quantity_reserved: 300,

    quantity_returned: 50,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Widget B',

    quantity_available: 2000,

    quantity_reserved: 400,

    quantity_returned: 75,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Gadget X',

    quantity_available: 1000,

    quantity_reserved: 200,

    quantity_returned: 30,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Gadget Y',

    quantity_available: 2500,

    quantity_reserved: 500,

    quantity_returned: 100,

    // type code here for "relation_one" field
  },

  {
    product_name: 'Component Z',

    quantity_available: 3000,

    quantity_reserved: 600,

    quantity_returned: 120,

    // type code here for "relation_one" field
  },
];

const MachineryData = [
  {
    name: 'Lathe Machine',

    maintenance_schedule: new Date('2023-11-01T10:00:00Z'),

    downtime: new Date('2023-11-01T12:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    name: 'Milling Machine',

    maintenance_schedule: new Date('2023-11-02T10:00:00Z'),

    downtime: new Date('2023-11-02T12:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    name: 'Drill Press',

    maintenance_schedule: new Date('2023-11-03T10:00:00Z'),

    downtime: new Date('2023-11-03T12:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    name: 'Grinder',

    maintenance_schedule: new Date('2023-11-04T10:00:00Z'),

    downtime: new Date('2023-11-04T12:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    name: 'CNC Machine',

    maintenance_schedule: new Date('2023-11-05T10:00:00Z'),

    downtime: new Date('2023-11-05T12:00:00Z'),

    // type code here for "relation_one" field
  },
];

const QualityControlData = [
  {
    check_name: 'Initial Inspection',

    check_date: new Date('2023-10-01T09:00:00Z'),

    result: 'Passed',

    // type code here for "relation_one" field
  },

  {
    check_name: 'Mid-Production Check',

    check_date: new Date('2023-10-15T09:00:00Z'),

    result: 'Passed',

    // type code here for "relation_one" field
  },

  {
    check_name: 'Final Inspection',

    check_date: new Date('2023-10-30T09:00:00Z'),

    result: 'Failed',

    // type code here for "relation_one" field
  },

  {
    check_name: 'Random Sample Check',

    check_date: new Date('2023-11-01T09:00:00Z'),

    result: 'Passed',

    // type code here for "relation_one" field
  },

  {
    check_name: 'Post-Production Audit',

    check_date: new Date('2023-11-15T09:00:00Z'),

    result: 'Passed',

    // type code here for "relation_one" field
  },
];

const RawMaterialsData = [
  {
    name: 'Steel',

    quantity: 5000,

    reorder_level: 1000,

    // type code here for "relation_one" field
  },

  {
    name: 'Aluminum',

    quantity: 3000,

    reorder_level: 800,

    // type code here for "relation_one" field
  },

  {
    name: 'Copper',

    quantity: 2000,

    reorder_level: 500,

    // type code here for "relation_one" field
  },

  {
    name: 'Plastic',

    quantity: 10000,

    reorder_level: 2000,

    // type code here for "relation_one" field
  },

  {
    name: 'Rubber',

    quantity: 7000,

    reorder_level: 1500,

    // type code here for "relation_one" field
  },
];

const SuppliersData = [
  {
    name: 'Supplier One',

    contract_terms: 'Annual contract with monthly deliveries',

    delivery_schedule: new Date('2023-10-01T08:00:00Z'),

    payment_records: 50000,

    // type code here for "relation_one" field
  },

  {
    name: 'Supplier Two',

    contract_terms: 'Bi-annual contract with quarterly deliveries',

    delivery_schedule: new Date('2023-10-15T08:00:00Z'),

    payment_records: 75000,

    // type code here for "relation_one" field
  },

  {
    name: 'Supplier Three',

    contract_terms: 'Monthly contract with weekly deliveries',

    delivery_schedule: new Date('2023-10-20T08:00:00Z'),

    payment_records: 30000,

    // type code here for "relation_one" field
  },

  {
    name: 'Supplier Four',

    contract_terms: 'Annual contract with bi-monthly deliveries',

    delivery_schedule: new Date('2023-11-01T08:00:00Z'),

    payment_records: 60000,

    // type code here for "relation_one" field
  },

  {
    name: 'Supplier Five',

    contract_terms: 'Quarterly contract with monthly deliveries',

    delivery_schedule: new Date('2023-11-10T08:00:00Z'),

    payment_records: 45000,

    // type code here for "relation_one" field
  },
];

const WorkOrdersData = [
  {
    order_number: 'WO-1001',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    order_number: 'WO-1002',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    order_number: 'WO-1003',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    order_number: 'WO-1004',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    order_number: 'WO-1005',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Karl Landsteiner',
  },

  {
    name: 'John Bardeen',
  },

  {
    name: 'Enrico Fermi',
  },

  {
    name: 'Ludwig Boltzmann',
  },

  {
    name: 'William Harvey',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User4 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (User4?.setOrganization) {
    await User4.setOrganization(relatedOrganization4);
  }
}

async function associateHumanResourceWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource0 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (HumanResource0?.setOrganization) {
    await HumanResource0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource1 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (HumanResource1?.setOrganization) {
    await HumanResource1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource2 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (HumanResource2?.setOrganization) {
    await HumanResource2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource3 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (HumanResource3?.setOrganization) {
    await HumanResource3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const HumanResource4 = await HumanResources.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (HumanResource4?.setOrganization) {
    await HumanResource4.setOrganization(relatedOrganization4);
  }
}

async function associateInventoryWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory0 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Inventory0?.setOrganization) {
    await Inventory0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory1 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Inventory1?.setOrganization) {
    await Inventory1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory2 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Inventory2?.setOrganization) {
    await Inventory2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory3 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Inventory3?.setOrganization) {
    await Inventory3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory4 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Inventory4?.setOrganization) {
    await Inventory4.setOrganization(relatedOrganization4);
  }
}

async function associateMachineryWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery0 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Machinery0?.setOrganization) {
    await Machinery0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery1 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Machinery1?.setOrganization) {
    await Machinery1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery2 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Machinery2?.setOrganization) {
    await Machinery2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery3 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Machinery3?.setOrganization) {
    await Machinery3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Machinery4 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Machinery4?.setOrganization) {
    await Machinery4.setOrganization(relatedOrganization4);
  }
}

async function associateQualityControlWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl0 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (QualityControl0?.setOrganization) {
    await QualityControl0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl1 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (QualityControl1?.setOrganization) {
    await QualityControl1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl2 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (QualityControl2?.setOrganization) {
    await QualityControl2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl3 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (QualityControl3?.setOrganization) {
    await QualityControl3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const QualityControl4 = await QualityControl.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (QualityControl4?.setOrganization) {
    await QualityControl4.setOrganization(relatedOrganization4);
  }
}

async function associateRawMaterialWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial0 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (RawMaterial0?.setOrganization) {
    await RawMaterial0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial1 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (RawMaterial1?.setOrganization) {
    await RawMaterial1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial2 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (RawMaterial2?.setOrganization) {
    await RawMaterial2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial3 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (RawMaterial3?.setOrganization) {
    await RawMaterial3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const RawMaterial4 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (RawMaterial4?.setOrganization) {
    await RawMaterial4.setOrganization(relatedOrganization4);
  }
}

async function associateSupplierWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier0 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Supplier0?.setOrganization) {
    await Supplier0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier1 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Supplier1?.setOrganization) {
    await Supplier1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier2 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Supplier2?.setOrganization) {
    await Supplier2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier3 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Supplier3?.setOrganization) {
    await Supplier3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Supplier4 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Supplier4?.setOrganization) {
    await Supplier4.setOrganization(relatedOrganization4);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateWorkOrderWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder0 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (WorkOrder0?.setOrganization) {
    await WorkOrder0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder1 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (WorkOrder1?.setOrganization) {
    await WorkOrder1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder2 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (WorkOrder2?.setOrganization) {
    await WorkOrder2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder3 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (WorkOrder3?.setOrganization) {
    await WorkOrder3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const WorkOrder4 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (WorkOrder4?.setOrganization) {
    await WorkOrder4.setOrganization(relatedOrganization4);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await HumanResources.bulkCreate(HumanResourcesData);

    await Inventory.bulkCreate(InventoryData);

    await Machinery.bulkCreate(MachineryData);

    await QualityControl.bulkCreate(QualityControlData);

    await RawMaterials.bulkCreate(RawMaterialsData);

    await Suppliers.bulkCreate(SuppliersData);

    await WorkOrders.bulkCreate(WorkOrdersData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateHumanResourceWithOrganization(),

      await associateInventoryWithOrganization(),

      await associateMachineryWithOrganization(),

      await associateQualityControlWithOrganization(),

      await associateRawMaterialWithOrganization(),

      await associateSupplierWithOrganization(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateWorkOrderWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('human_resources', null, {});

    await queryInterface.bulkDelete('inventory', null, {});

    await queryInterface.bulkDelete('machinery', null, {});

    await queryInterface.bulkDelete('quality_control', null, {});

    await queryInterface.bulkDelete('raw_materials', null, {});

    await queryInterface.bulkDelete('suppliers', null, {});

    await queryInterface.bulkDelete('work_orders', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
