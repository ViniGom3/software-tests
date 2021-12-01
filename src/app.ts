import 'dotenv/config';
import { app } from './index';

app.listen(process.env.PORT, () =>
  console.log('🚀 Server running at http://localhost:' + process.env.PORT),
);
