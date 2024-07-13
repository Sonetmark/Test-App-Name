const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const work_orders = sequelize.define(
    'work_orders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      order_number: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  work_orders.associate = (db) => {
    db.work_orders.belongsToMany(db.raw_materials, {
      as: 'materials',
      foreignKey: {
        name: 'work_orders_materialsId',
      },
      constraints: false,
      through: 'work_ordersMaterialsRaw_materials',
    });

    db.work_orders.belongsToMany(db.users, {
      as: 'labor',
      foreignKey: {
        name: 'work_orders_laborId',
      },
      constraints: false,
      through: 'work_ordersLaborUsers',
    });

    db.work_orders.belongsToMany(db.machinery, {
      as: 'machinery',
      foreignKey: {
        name: 'work_orders_machineryId',
      },
      constraints: false,
      through: 'work_ordersMachineryMachinery',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.work_orders.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.work_orders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.work_orders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return work_orders;
};
