import axios from 'axios';

export default (data) => axios.post('/api/authenticate', data);
