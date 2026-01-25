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
import client from 'prom-client';

const app = express();

const collectDefaultMetrics = client.collectDefaultMetrics;

const Registry = client.Registry;
const register = new Registry();

collectDefaultMetrics({ register: register });

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

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.send
  (metrics);
});

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
