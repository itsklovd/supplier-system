const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Trasy dla dostawców
router.get('/', supplierController.getSuppliers);
router.get('/by-country', supplierController.getSuppliersByCountry);
router.get('/:id', supplierController.getSupplier);
router.post('/', supplierController.createSupplier);
router.put('/:id', supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

// Trasy dla produktów
router.post('/:id/products', supplierController.addProduct);
router.put('/:supplierId/products/:productId', supplierController.updateProduct);
router.delete('/:supplierId/products/:productId', supplierController.deleteProduct);

module.exports = router;
