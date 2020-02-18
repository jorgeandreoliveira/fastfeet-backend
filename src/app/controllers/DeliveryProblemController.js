import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    if (id) return res.json(await DeliveryProblem.findByPk(id));
    return res.json(await DeliveryProblem.findAll());
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
