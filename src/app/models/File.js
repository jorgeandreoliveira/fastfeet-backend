import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        tableName: 'files',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        sequelize,
      }
    );

    return this;
  }
}

export default File;
