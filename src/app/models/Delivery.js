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
            if (this.getDataValue('canceled_at') != null) return 'CANCELADA';
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
        color: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.getDataValue('end_date') != null) return '#2CA42B';
            if (this.getDataValue('canceled_at') != null) return '#DE3B3B';
            if (
              this.getDataValue('start_date') == null &&
              this.getDataValue('end_date') == null
            )
              return '#C1BC35';
            if (
              this.getDataValue('start_date') != null &&
              this.getDataValue('end_date') == null
            )
              return '#4D85EE';

            return '#C1BC35';
          },
        },
        backgroundcolor: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.getDataValue('end_date') != null) return '#DFF0DF';
            if (this.getDataValue('canceled_at') != null) return '#FAB0B0';
            if (
              this.getDataValue('start_date') == null &&
              this.getDataValue('end_date') == null
            )
              return '#F0F0DF';
            if (
              this.getDataValue('start_date') != null &&
              this.getDataValue('end_date') == null
            )
              return '#BAD2FF';

            return '#F0F0DF';
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
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    this.hasMany(models.DeliveryProblem, { foreignKey: 'delivery_id' });
  }
}

export default Delivery;
