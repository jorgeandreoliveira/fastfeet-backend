import * as Yup from 'yup';
import { getHours, isBefore, parseISO } from 'date-fns';
import { Sequelize } from 'sequelize';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Mail from '../../lib/Mail';
import Recipient from '../models/Recipient';

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
        ],
      });
    } else if (id) {
      deliveries = await Delivery.findByPk(id, {
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

    const deliveryMan = await DeliveryMan.findByPk(recipient_id);

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Produto disponível para entrega',
      text: `${product}`,
      template: 'layouts/default',
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
    const { start_date, end_date, deliveryman_id } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery dos not exists' });
    }

    let deliveries = 0;

    if (start_date) {
      // A data de início deve ser cadastrada assim que for feita a retirada do produto pelo entregador,
      // e as retiradas só podem ser feitas entre as 08:00 e 18:00h.
      if (
        getHours(parseISO(start_date)) < 8 ||
        getHours(parseISO(start_date)) > 18
      )
        return res
          .status(400)
          .json({ error: 'Hour outside the allowed limit 08:00h - 18:00h' });

      // O entregador só pode fazer 5 retiradas por dia
      deliveries = await Delivery.findAndCountAll({
        where: {
          deliveryman_id,
        },
      });

      if (deliveries.count > 5)
        return res.status(400).json({ error: 'Five deliveries exceeded' });
    }
    // Data de término menor que a data de início
    if (end_date) {
      if (isBefore(parseISO(end_date), parseISO(start_date)))
        return res
          .status(400)
          .json({ error: 'End date less than the start date' });
    }

    const updatedDelivery = await delivery.update(req.body);

    return res.json(updatedDelivery);
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
