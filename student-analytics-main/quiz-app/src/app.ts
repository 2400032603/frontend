import express from 'express';
import bodyParser from 'body-parser';
import { setupQuizRoutes } from './routes/quiz';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setupQuizRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});