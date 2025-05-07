const Supplier = require('../models/Supplier');

// Pobierz wszystkich dostawców
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().select('name country');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pobierz dostawców według kraju
exports.getSuppliersByCountry = async (req, res) => {
  try {
    const suppliers = await Supplier.find().select('name country');
    
    // Grupowanie dostawców według krajów
    const suppliersByCountry = suppliers.reduce((acc, supplier) => {
      const country = supplier.country || 'Other';
      if (!acc[country]) acc[country] = [];
      acc[country].push(supplier);
      return acc;
    }, {});
    
    res.json(suppliersByCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pobierz szczegóły dostawcy
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dodaj nowego dostawcę
exports.createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Aktualizuj dostawcę
exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedSupplier) return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Usuń dostawcę
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    res.json({ message: 'Dostawca usunięty' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dodaj produkt do dostawcy
exports.addProduct = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    
    supplier.products.push(req.body);
    supplier.updatedAt = Date.now();
    
    const updatedSupplier = await supplier.save();
    res.status(201).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Aktualizuj produkt
exports.updateProduct = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    
    const productIndex = supplier.products.findIndex(p => p._id.toString() === req.params.productId);
    if (productIndex === -1) return res.status(404).json({ message: 'Produkt nie znaleziony' });
    
    supplier.products[productIndex] = { ...supplier.products[productIndex], ...req.body };
    supplier.updatedAt = Date.now();
    
    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Usuń produkt
exports.deleteProduct = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    
    supplier.products = supplier.products.filter(p => p._id.toString() !== req.params.productId);
    supplier.updatedAt = Date.now();
    
    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
