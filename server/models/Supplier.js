const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  sku: String,
  brand: String,
  manufacturer: String,
  countryOfOrigin: String,
  category: String,
  description: String,
  composition: String,
  allergens: String,
  physicalParams: String,
  microbiologicalParams: String,
  shelfLife: String,
  storageConditions: String,
  qualityCertificates: String,
  
  // Standards
  organic: Boolean,
  vegan: Boolean,
  vegetarian: Boolean,
  glutenFree: Boolean,
  lactoseFree: Boolean,
  lowSugar: Boolean,
  lowCalorie: Boolean,
  kosher: Boolean,
  
  nutritionalValues: String,
  
  // Packaging
  unitPackaging: String,
  netWeight: String,
  grossWeight: String,
  unitDimensions: String,
  unitsInBox: Number,
  boxDimensions: String,
  boxWeight: String,
  boxesPerPallet: Number,
  layersPerPallet: Number,
  palletType: String,
  palletHeight: String,
  palletWeight: String,
  
  // Transport and logistics
  transportConditions: String,
  additionalLogistics: String,
  
  // Commercial
  unitPrice: Number,
  currency: String,
  minimumOrder: String,
  leadTime: Number,
  paymentTerms: String,
  incoterms: String,
  
  // Quantity discounts
  quantityDiscounts: [{
    quantity: Number,
    discount: Number
  }],
  
  additionalCommercial: String,
  
  // Marketing
  marketingClaims: String,
  targetGroup: String,
  innovationLevel: Number,
  
  // Private label
  privateLabelAvailable: Boolean,
  
  // Documents
  attachedDocuments: {
    technicalSpec: Boolean,
    safetySheet: Boolean,
    certificates: Boolean,
    productPhotos: Boolean
  },
  
  // Seasonal availability
  seasonalAvailability: {
    january: Boolean,
    february: Boolean,
    march: Boolean,
    april: Boolean,
    may: Boolean,
    june: Boolean,
    july: Boolean,
    august: Boolean,
    september: Boolean,
    october: Boolean,
    november: Boolean,
    december: Boolean
  },
  
  additionalNotes: String
}, { timestamps: true });

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  address: String,
  contactPerson: String,
  email: String,
  phone: String,
  website: String,
  products: [ProductSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
