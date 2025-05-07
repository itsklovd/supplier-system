const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const Supplier = require('../models/Supplier');

exports.generateSupplierPdf = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Dostawca nie znaleziony' });
    }

    // Utworzenie nowego dokumentu PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `supplier_${supplier._id}.pdf`;
    const filePath = path.join(__dirname, '..', 'temp', filename);
    
    // Upewnij się, że folder istnieje
    await fs.ensureDir(path.join(__dirname, '..', 'temp'));
    
    // Skonfiguruj nagłówki dla pobrania pliku
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');
    
    // Pipe do odpowiedzi
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.pipe(res);

    // Zawartość PDF - nagłówek
    doc.font('Helvetica-Bold').fontSize(24).text('Profil dostawcy', { align: 'center' });
    doc.moveDown();
    
    // Dane dostawcy
    doc.fontSize(18).text(supplier.name, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text('Dane podstawowe', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Kraj: ${supplier.country || 'Nie podano'}`);
    doc.text(`Adres: ${supplier.address || 'Nie podano'}`);
    doc.text(`Osoba kontaktowa: ${supplier.contactPerson || 'Nie podano'}`);
    doc.text(`Email: ${supplier.email || 'Nie podano'}`);
    doc.text(`Telefon: ${supplier.phone || 'Nie podano'}`);
    doc.text(`Strona www: ${supplier.website || 'Nie podano'}`);
    doc.moveDown();
    
    // Lista produktów
    doc.fontSize(14).text('Produkty', { underline: true });
    doc.moveDown(0.5);
    
    if (!supplier.products?.length) {
      doc.text('Ten dostawca nie ma jeszcze żadnych produktów.');
    } else {
      supplier.products.forEach((product, index) => {
        // Nowa strona dla każdego produktu (z wyjątkiem pierwszego)
        if (index > 0) {
          doc.addPage();
        }
        
        doc.fontSize(14).text(`${index + 1}. ${product.name || 'Bez nazwy'}`, { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(12).text(`SKU: ${product.sku || 'Nie podano'}`);
        doc.text(`Marka: ${product.brand || 'Nie podano'}`);
        doc.text(`Producent: ${product.manufacturer || 'Nie podano'}`);
        doc.text(`Kategoria: ${product.category || 'Nie podano'}`);
        doc.text(`Kraj pochodzenia: ${product.countryOfOrigin || 'Nie podano'}`);
        doc.moveDown();
        
        doc.text('Dostępność sezonowa:');
        const months = [
          { name: 'Styczeń', key: 'january' },
          { name: 'Luty', key: 'february' },
          { name: 'Marzec', key: 'march' },
          { name: 'Kwiecień', key: 'april' },
          { name: 'Maj', key: 'may' },
          { name: 'Czerwiec', key: 'june' },
          { name: 'Lipiec', key: 'july' },
          { name: 'Sierpień', key: 'august' },
          { name: 'Wrzesień', key: 'september' },
          { name: 'Październik', key: 'october' },
          { name: 'Listopad', key: 'november' },
          { name: 'Grudzień', key: 'december' }
        ];
        
        let monthText = '';
        months.forEach((month, i) => {
          const available = product.seasonalAvailability && product.seasonalAvailability[month.key];
          monthText += `${month.name}: ${available ? '✓' : '✗'}   `;
          
          if ((i + 1) % 4 === 0 || i === months.length - 1) {
            doc.text(monthText);
            monthText = '';
          }
        });
        doc.moveDown();
        
        doc.text('Standardy:');
        doc.text(`Ekologiczny: ${product.organic ? '✓' : '✗'}   Wegański: ${product.vegan ? '✓' : '✗'}   Wegetariański: ${product.vegetarian ? '✓' : '✗'}   Bezglutenowy: ${product.glutenFree ? '✓' : '✗'}`);
        doc.text(`Bez laktozy: ${product.lactoseFree ? '✓' : '✗'}   Niskocukrowy: ${product.lowSugar ? '✓' : '✗'}   Niskokaloryczny: ${product.lowCalorie ? '✓' : '✗'}   Koszerny: ${product.kosher ? '✓' : '✗'}`);
        doc.moveDown();
        
        if (product.description) {
          doc.text('Opis produktu:');
          doc.text(product.description);
          doc.moveDown();
        }
        
        if (product.nutritionalValues) {
          doc.text('Wartości odżywcze (na 100g/ml):');
          doc.text(product.nutritionalValues);
          doc.moveDown();
        }
        
        // Dane handlowe
        if (product.unitPrice) {
          doc.text(`Cena jednostkowa: ${product.unitPrice} ${product.currency || ''}`);
        }
        if (product.minimumOrder) {
          doc.text(`Minimalne zamówienie: ${product.minimumOrder}`);
        }
        if (product.leadTime) {
          doc.text(`Czas realizacji: ${product.leadTime} dni`);
        }
      });
    }
    
    // Stopka
    doc.fontSize(10).text(`Wygenerowano: ${new Date().toLocaleString()}`, { align: 'center' });
    
    // Zakończenie dokumentu
    doc.end();

    // Usuwanie pliku po wysłaniu
    stream.on('finish', () => {
      setTimeout(() => {
        fs.remove(filePath).catch(err => console.error('Błąd podczas usuwania pliku:', err));
      }, 5000);
    });

  } catch (error) {
    console.error('Błąd generowania PDF:', error);
    res.status(500).json({ message: 'Błąd podczas generowania PDF.' });
  }
};
