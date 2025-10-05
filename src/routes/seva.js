const express = require('express');
const router = express.Router();
const SevaController = require('../controllers/seva.controller');

router.post('/create-seva', SevaController.createSeva);
router.post('/update-seva', SevaController.updateSeva);
router.delete('/delete/:id', SevaController.deleteSeva);
router.get('/get-sevas', SevaController.getAllSevas);
router.get('/:id', SevaController.getSevaById);

module.exports = router;
