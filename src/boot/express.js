import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

const isDevelopment = process.env.NODE_ENV === 'development';

export default app => {
  if (isDevelopment) {
    // Логи
    app.use(morgan('combined'));
  }

  // CORS
  app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

  // парсинг тела запросов
  app.use(bodyParser.json());
}