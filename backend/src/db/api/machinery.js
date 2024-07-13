const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MachineryDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const machinery = await db.machinery.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        maintenance_schedule: data.maintenance_schedule || null,
        downtime: data.downtime || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await machinery.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return machinery;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const machineryData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      maintenance_schedule: item.maintenance_schedule || null,
      downtime: item.downtime || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const machinery = await db.machinery.bulkCreate(machineryData, {
      transaction,
    });

    // For each item created, replace relation files

    return machinery;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const machinery = await db.machinery.findByPk(id, {}, { transaction });

    await machinery.update(
      {
        name: data.name || null,
        maintenance_schedule: data.maintenance_schedule || null,
        downtime: data.downtime || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await machinery.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return machinery;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const machinery = await db.machinery.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of machinery) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of machinery) {
        await record.destroy({ transaction });
      }
    });

    return machinery;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const machinery = await db.machinery.findByPk(id, options);

    await machinery.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await machinery.destroy({
      transaction,
    });

    return machinery;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const machinery = await db.machinery.findOne({ where }, { transaction });

    if (!machinery) {
      return machinery;
    }

    const output = machinery.get({ plain: true });

    output.organization = await machinery.getOrganization({
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

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('machinery', 'name', filter.name),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              maintenance_schedule: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              downtime: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.maintenance_scheduleRange) {
        const [start, end] = filter.maintenance_scheduleRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            maintenance_schedule: {
              ...where.maintenance_schedule,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            maintenance_schedule: {
              ...where.maintenance_schedule,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.downtimeRange) {
        const [start, end] = filter.downtimeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            downtime: {
              ...where.downtime,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            downtime: {
              ...where.downtime,
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
          count: await db.machinery.count({
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
      : await db.machinery.findAndCountAll({
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
          Utils.ilike('machinery', 'name', query),
        ],
      };
    }

    const records = await db.machinery.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
