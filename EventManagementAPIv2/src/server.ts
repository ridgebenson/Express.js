import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { CustomError, customErrorHandler } from './../middleware/customErrorHandler';
import eventRoutes from './../routes/eventRoutes';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/events', eventRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error: CustomError = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(customErrorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));