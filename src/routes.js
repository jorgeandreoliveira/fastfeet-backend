import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';

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

export default routes;
