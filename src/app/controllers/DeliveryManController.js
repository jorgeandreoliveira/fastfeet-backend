import * as Yup from 'yup';
import Sequelize from 'sequelize';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async index(req, res) {
    const { email, id } = req.params;

    let deliverymen = [];

    if (id) {
      deliverymen = await DeliveryMan.findByPk(id);
    } else if (email) {
      deliverymen = await DeliveryMan.findAll({
        where: {
          email: {
            [Sequelize.Op.like]: `%${email}%`,
          },
        },
      });
    } else {
      deliverymen = await DeliveryMan.findAll();
    }

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const delivererExists = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (delivererExists) {
      return res.status(400).json({ error: 'Delivere already exists' });
    }

    const { id, name, avatar_id, email } = await DeliveryMan.create(req.body);

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async update(req, res) {
    const { email } = req.body;
    const { id } = req.params;

    const deliveryMan = await DeliveryMan.findByPk(id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Deliverer dos not exists' });
    }

    if (email !== deliveryMan.email) {
      const deliveryManExists = await DeliveryMan.findOne({ where: { email } });

      if (deliveryManExists) {
        return res.status(400).json({
          error: 'Deliverer already exists',
        });
      }
    }

    const updatedDeliveryMan = await deliveryMan.update(req.body);

    return res.json(updatedDeliveryMan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryMan = await DeliveryMan.findByPk(id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Deliverer does not exists' });
    }

    await deliveryMan.destroy();

    return res.status(200).json({ msg: 'Deliverer successfully deleted' });
  }
}

export default new DeliveryManController();
