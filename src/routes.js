import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Autenticação
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Recipient
routes.get('/recipient/:id', RecipientController.index);
routes.get('/recipient/:nome', RecipientController.index);
routes.get('/recipient', RecipientController.index);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

// Deliverer
routes.get('/deliverer/:id', DeliveryManController.index);
routes.get('/deliverer/:email', DeliveryManController.index);
routes.get('/deliverer', DeliveryManController.index);
routes.post('/deliverer', DeliveryManController.store);
routes.put('/deliverer/:id', DeliveryManController.update);
routes.delete('/deliverer/:id', DeliveryManController.delete);

export default routes;
