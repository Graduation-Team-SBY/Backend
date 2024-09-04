import { Request, Response, Router } from 'express';
import { errorHandler } from '../middlewares/errorhandler';
import Controller from '../controllers';
import { router as jobRouter } from './job';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running...' });
});

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.use('/job', jobRouter)

router.use(errorHandler);