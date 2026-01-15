import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import routes from './routes';
import { NotFoundError, ApiError } from './core/ApiError';
import cors from 'cors';
import connectDB from './database/db';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(express.json());

void connectDB();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.get('/health', (req, res) => {
  res.status(200).send('Node server working fine');
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.use((req, res, next) => next(new NotFoundError()));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return ApiError.handle(err, res);
  }
  console.error(err);
  return res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
  });
});

export default app;
