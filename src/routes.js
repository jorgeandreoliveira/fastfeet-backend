import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Autentication
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Recipient
routes.get('/recipient/:id', RecipientController.index);
routes.get('/recipient/:nome', RecipientController.index);
routes.get('/recipient', RecipientController.index);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

// Delivery
routes.get('/deliveries', DeliveryController.index);
routes.get('/delivery/:id', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

// DeliveryMan
routes.get('/deliveryman/:id', DeliveryManController.index);
routes.get('/deliveryman', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);

// DeliveryProblem
routes.get('/deliveryproblem/:id', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

export default routes;
