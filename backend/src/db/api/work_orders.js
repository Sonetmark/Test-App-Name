const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Work_ordersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.create(
      {
        id: data.id || undefined,

        order_number: data.order_number || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await work_orders.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await work_orders.setMaterials(data.materials || [], {
      transaction,
    });

    await work_orders.setLabor(data.labor || [], {
      transaction,
    });

    await work_orders.setMachinery(data.machinery || [], {
      transaction,
    });

    return work_orders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const work_ordersData = data.map((item, index) => ({
      id: item.id || undefined,

      order_number: item.order_number || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const work_orders = await db.work_orders.bulkCreate(work_ordersData, {
      transaction,
    });

    // For each item created, replace relation files

    return work_orders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const work_orders = await db.work_orders.findByPk(id, {}, { transaction });

    await work_orders.update(
      {
        order_number: data.order_number || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await work_orders.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    await work_orders.setMaterials(data.materials || [], {
      transaction,
    });

    await work_orders.setLabor(data.labor || [], {
      transaction,
    });

    await work_orders.setMachinery(data.machinery || [], {
      transaction,
    });

    return work_orders;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of work_orders) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of work_orders) {
        await record.destroy({ transaction });
      }
    });

    return work_orders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findByPk(id, options);

    await work_orders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await work_orders.destroy({
      transaction,
    });

    return work_orders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findOne(
      { where },
      { transaction },
    );

    if (!work_orders) {
      return work_orders;
    }

    const output = work_orders.get({ plain: true });

    output.materials = await work_orders.getMaterials({
      transaction,
    });

    output.labor = await work_orders.getLabor({
      transaction,
    });

    output.machinery = await work_orders.getMachinery({
      transaction,
    });

    output.organization = await work_orders.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.organizations,
        as: 'organization',
      },

      {
        model: db.raw_materials,
        as: 'materials',
        through: filter.materials
          ? {
              where: {
                [Op.or]: filter.materials.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.materials ? true : null,
      },

      {
        model: db.users,
        as: 'labor',
        through: filter.labor
          ? {
              where: {
                [Op.or]: filter.labor.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.labor ? true : null,
      },

      {
        model: db.machinery,
        as: 'machinery',
        through: filter.machinery
          ? {
              where: {
                [Op.or]: filter.machinery.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.machinery ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.order_number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'work_orders',
            'order_number',
            filter.order_number,
          ),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.work_orders.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.work_orders.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('work_orders', 'order_number', query),
        ],
      };
    }

    const records = await db.work_orders.findAll({
      attributes: ['id', 'order_number'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['order_number', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.order_number,
    }));
  }
};
