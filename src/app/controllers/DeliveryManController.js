import * as Yup from 'yup';
import { Sequelize } from 'sequelize';
import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryProblem from '../models/DeliveryProblem';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const { id, q, delivered } = req.params;

    let deliveries = [];

    if (!delivered && !id) {
      return res.json(await DeliveryMan.findAll());
    }

    if (id && !delivered) {
      return res.json(
        await DeliveryMan.findOne({
          where: { id },
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        })
      );
    }

    if (q) {
      deliveries = await DeliveryMan.findAll({
        where: {
          name: {
            [Sequelize.Op.like]: `%${q}%`,
          },
        },
      });
    } else if (delivered === 'true') {
      deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          end_date: { [Sequelize.Op.ne]: null },
        },
        attributes: [
          'id',
          'recipient_id',
          'deliveryman_id',
          'product',
          'created_at',
          'canceled_at',
          'start_date',
          'end_date',
          'status',
        ],
        include: [
          {
            model: Recipient,
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'state',
              'city',
              'zipcode',
            ],
          },
          {
            model: DeliveryProblem,
            attributes: ['id', 'description', 'created_at'],
          },
        ],
      });
    } else {
      deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          canceled_at: null,
          end_date: null,
        },
        attributes: [
          'id',
          'recipient_id',
          'deliveryman_id',
          'product',
          'canceled_at',
          'created_at',
          'start_date',
          'end_date',
          'status',
        ],
        include: [
          {
            model: Recipient,
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'state',
              'city',
              'zipcode',
            ],
          },
          {
            model: DeliveryProblem,
            attributes: ['id', 'description', 'created_at'],
          },
        ],
      });
    }
    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
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
