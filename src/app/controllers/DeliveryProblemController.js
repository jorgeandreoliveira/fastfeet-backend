import * as Yup from 'yup';
import { parseISO, format } from 'date-fns';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import DeliveryProblem from '../models/DeliveryProblem';
import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async index(req, res) {
    const { id, delivery_id } = req.params;

    if (id) {
      return res.json(await DeliveryProblem.findByPk(id));
    }

    if (delivery_id) {
      return res.json(
        await DeliveryProblem.findAll({
          where: { delivery_id },
        })
      );
    }

    return res.json(
      await DeliveryProblem.findAll({
        order: [['delivery_id', 'ASC']],
      })
    );
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number()
        .integer()
        .required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id, delivery_id, description } = await DeliveryProblem.create(
      req.body
    );

    return res.json({
      id,
      delivery_id,
      description,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { canceled_at } = req.body;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery dos not exists' });
    }

    const updatedDelivery = await delivery.update(req.body);

    const deliveryMan = await DeliveryMan.findByPk(delivery.deliveryman_id);

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Encomenda cancelada',
      template: 'canceldelivery',
      context: {
        entregador: deliveryMan.name,
        produto: delivery.product,
        data: format(parseISO(canceled_at), 'dd/MM/yyyy HH:mm'),
      },
    });

    return res.json(updatedDelivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id);

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not exists' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);

    delivery.canceled_at = new Date();

    await Delivery.update(delivery);

    return res.status(200).json({ msg: 'Delivery successfully canceled' });
  }
}

export default new DeliveryProblemController();
