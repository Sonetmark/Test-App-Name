const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Human_resourcesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const human_resources = await db.human_resources.create(
      {
        id: data.id || undefined,

        employee_name: data.employee_name || null,
        role: data.role || null,
        shift: data.shift || null,
        payroll: data.payroll || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await human_resources.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return human_resources;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const human_resourcesData = data.map((item, index) => ({
      id: item.id || undefined,

      employee_name: item.employee_name || null,
      role: item.role || null,
      shift: item.shift || null,
      payroll: item.payroll || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const human_resources = await db.human_resources.bulkCreate(
      human_resourcesData,
      { transaction },
    );

    // For each item created, replace relation files

    return human_resources;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const human_resources = await db.human_resources.findByPk(
      id,
      {},
      { transaction },
    );

    await human_resources.update(
      {
        employee_name: data.employee_name || null,
        role: data.role || null,
        shift: data.shift || null,
        payroll: data.payroll || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await human_resources.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return human_resources;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const human_resources = await db.human_resources.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of human_resources) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of human_resources) {
        await record.destroy({ transaction });
      }
    });

    return human_resources;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const human_resources = await db.human_resources.findByPk(id, options);

    await human_resources.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await human_resources.destroy({
      transaction,
    });

    return human_resources;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const human_resources = await db.human_resources.findOne(
      { where },
      { transaction },
    );

    if (!human_resources) {
      return human_resources;
    }

    const output = human_resources.get({ plain: true });

    output.organization = await human_resources.getOrganization({
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
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.employee_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'human_resources',
            'employee_name',
            filter.employee_name,
          ),
        };
      }

      if (filter.role) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('human_resources', 'role', filter.role),
        };
      }

      if (filter.shift) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('human_resources', 'shift', filter.shift),
        };
      }

      if (filter.payrollRange) {
        const [start, end] = filter.payrollRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            payroll: {
              ...where.payroll,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            payroll: {
              ...where.payroll,
              [Op.lte]: end,
            },
          };
        }
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
          count: await db.human_resources.count({
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
      : await db.human_resources.findAndCountAll({
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
          Utils.ilike('human_resources', 'employee_name', query),
        ],
      };
    }

    const records = await db.human_resources.findAll({
      attributes: ['id', 'employee_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['employee_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.employee_name,
    }));
  }
};
