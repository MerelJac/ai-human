const router = require('express').Router();

import apiRoutes from './api';

router.use('/api', apiRoutes);

export default router;    