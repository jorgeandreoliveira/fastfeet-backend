import * as Yup from 'yup';
import { getHours, parseISO } from 'date-fns';
import { Sequelize } from 'sequelize';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Mail from '../../lib/Mail';
import Recipient from '../models/Recipient';
import DeliveryProblem from '../models/DeliveryProblem';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const { id, q } = req.params;

    let deliveries = [];

    if (q) {
      deliveries = await Delivery.findAll({
        where: {
          product: {
            [Sequelize.Op.like]: `%${q}%`,
          },
        },
        attributes: [
          'id',
          'recipient_id',
          'deliveryman_id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'status',
          'color',
          'backgroundcolor',
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
            model: DeliveryMan,
            attributes: ['id', 'name'],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
    } else if (id) {
      deliveries = await Delivery.findByPk(id, {
        attributes: [
          'id',
          'recipient_id',
          'deliveryman_id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'status',
          'color',
          'backgroundcolor',
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
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
    } else {
      deliveries = await Delivery.findAll({
        attributes: [
          'id',
          'recipient_id',
          'deliveryman_id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'status',
          'color',
          'backgroundcolor',
        ],
        order: [['id', 'ASC']],
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
            model: DeliveryMan,
            attributes: ['id', 'name'],
          },
          {
            model: DeliveryProblem,
            attributes: ['id', 'description', 'created_at'],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
    }
    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number()
        .integer()
        .required(),
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
    } = await Delivery.create(req.body);

    const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Produto disponível para entrega',
      template: 'delivery',
      context: {
        entregador: deliveryMan.name,
        produto: product,
      },
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { start_date, end_date, deliveryman_id, signature_id } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery dos not exists' });
    }

    if (signature_id) {
      await delivery.update({
        signature_id,
        end_date: new Date(),
      });
    } else {
      if (start_date && !end_date) {
        if (
          getHours(parseISO(start_date)) < 8 ||
          getHours(parseISO(start_date)) > 18
        )
          return res
            .status(400)
            .json({ error: 'Retirada permitida de 08:00h às 18:00h' });
      }

      const deliveries = await Delivery.findAndCountAll({
        where: {
          deliveryman_id,
        },
      });

      if (deliveries.count > 5)
        return res
          .status(400)
          .json({ error: 'Limite de cinco entregas excedido!' });

      await delivery.update(req.body);
    }
    const response = await Delivery.findByPk(id);

    return res.json(response.data);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    await Delivery.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({ msg: 'Delivery successfully deleted' });
  }
}

export default new DeliveryController();
