import Sequelize, { Model } from 'sequelize';

class DeliveryMan extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: Sequelize.STRING,
        avatar_id: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        tableName: 'deliverer',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        sequelize,
      }
    );

    return this;
  }
}

export default DeliveryMan;
