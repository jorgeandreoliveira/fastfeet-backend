import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/files', upload.single('file'), FileController.store);

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

// DeliveryMan
routes.get('/deliveryman/:id', DeliveryManController.index);
routes.get('/deliveryman/:email', DeliveryManController.index);
routes.get('/deliveryman', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);

export default routes;
