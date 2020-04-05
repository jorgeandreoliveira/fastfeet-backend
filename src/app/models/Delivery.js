import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.getDataValue('end_date') != null) return 'ENTREGUE';
            if (
              this.getDataValue('start_date') == null &&
              this.getDataValue('end_date') == null
            )
              return 'PENDENTE';
            if (
              this.getDataValue('start_date') != null &&
              this.getDataValue('end_date') == null
            )
              return 'RETIRADA';

            return 'PENDENTE';
          },
        },
      },
      {
        tableName: 'delivery',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, { foreignKey: 'recipient_id' });
    this.belongsTo(models.DeliveryMan, { foreignKey: 'deliveryman_id' });
    this.belongsTo(models.File, { foreignKey: 'signature_id' });
    this.hasMany(models.DeliveryProblem, { foreignKey: 'delivery_id' });
  }
}

export default Delivery;
