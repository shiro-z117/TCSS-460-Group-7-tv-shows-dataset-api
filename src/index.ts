import 'dotenv/config'; // loads .env early
import app from './app';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Listening on :${PORT}`));
