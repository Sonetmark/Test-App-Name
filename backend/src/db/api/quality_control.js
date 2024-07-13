const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Quality_controlDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.create(
      {
        id: data.id || undefined,

        check_name: data.check_name || null,
        check_date: data.check_date || null,
        result: data.result || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await quality_control.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return quality_control;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const quality_controlData = data.map((item, index) => ({
      id: item.id || undefined,

      check_name: item.check_name || null,
      check_date: item.check_date || null,
      result: item.result || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const quality_control = await db.quality_control.bulkCreate(
      quality_controlData,
      { transaction },
    );

    // For each item created, replace relation files

    return quality_control;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const quality_control = await db.quality_control.findByPk(
      id,
      {},
      { transaction },
    );

    await quality_control.update(
      {
        check_name: data.check_name || null,
        check_date: data.check_date || null,
        result: data.result || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await quality_control.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return quality_control;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of quality_control) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of quality_control) {
        await record.destroy({ transaction });
      }
    });

    return quality_control;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findByPk(id, options);

    await quality_control.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await quality_control.destroy({
      transaction,
    });

    return quality_control;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const quality_control = await db.quality_control.findOne(
      { where },
      { transaction },
    );

    if (!quality_control) {
      return quality_control;
    }

    const output = quality_control.get({ plain: true });

    output.organization = await quality_control.getOrganization({
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

      if (filter.check_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'quality_control',
            'check_name',
            filter.check_name,
          ),
        };
      }

      if (filter.result) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('quality_control', 'result', filter.result),
        };
      }

      if (filter.check_dateRange) {
        const [start, end] = filter.check_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
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
          count: await db.quality_control.count({
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
      : await db.quality_control.findAndCountAll({
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
          Utils.ilike('quality_control', 'check_name', query),
        ],
      };
    }

    const records = await db.quality_control.findAll({
      attributes: ['id', 'check_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['check_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.check_name,
    }));
  }
};
