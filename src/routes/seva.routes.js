const express = require('express');
const router = express.Router();
const SevaController = require('../controllers/seva.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/create-seva', authenticate, SevaController.createSeva);
router.post('/update-seva', authenticate, SevaController.updateSeva);
router.post('/delete/:id', authenticate, SevaController.deleteSeva);
router.get('/get-sevas', SevaController.getAllSevas);
router.get('/:id', SevaController.getSevaById);

module.exports = router;
