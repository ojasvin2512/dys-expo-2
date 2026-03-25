import { app } from './api/index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/api/test-databricks\n`);
});
