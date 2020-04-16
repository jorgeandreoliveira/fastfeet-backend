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

routes.get('/deliveryman/:id', DeliveryManController.index);
routes.get('/deliveryman/:id/:delivered', DeliveryManController.index);
routes.get('/deliveryman', DeliveryManController.index);
routes.get('/deliveryman/:id/deliveries', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.put('/problem/:id/cancel-delivery', DeliveryProblemController.update);
routes.get('/delivery/:id/problems', DeliveryController.index);
routes.get('/delivery/:id', DeliveryController.index);
routes.put('/delivery/:id', DeliveryController.update);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/recipient/:id', RecipientController.index);
routes.get('/recipient/:nome', RecipientController.index);
routes.get('/recipient', RecipientController.index);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.delete('/recipient/:id', RecipientController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.delete('/delivery/:id', DeliveryController.delete);

routes.get('/deliveryproblem', DeliveryProblemController.index);
routes.get('/deliveryproblem/:id', DeliveryProblemController.index);

export default routes;
