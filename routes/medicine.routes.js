const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

router.post('/medicines', medicineController.createMedicine);
router.get('/medicines/:id', medicineController.getMedicine);
router.put('/medicines/:id', medicineController.updateMedicine);
router.delete('/medicines/:id', medicineController.deleteMedicine);

router.post('/medicine-stocks', medicineController.createMedicineStock);
router.get('/medicine-stocks/:id', medicineController.getMedicineStock);
router.put('/medicine-stocks/:id', medicineController.updateMedicineStock);
router.delete('/medicine-stocks/:id', medicineController.deleteMedicineStock);

router.post('/medicine-stocks/predict', medicineController.predictMedicineStock);

module.exports = router;