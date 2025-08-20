const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Media = require('../models/products');
const QRCode = require('qrcode');
const mongoose = require('mongoose');


const router = express.Router();

const ensureDir = (p) => { fs.mkdirSync(p, { recursive: true }); };

// Multer storage that uses req._productId
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ensure a single product folder id for the request
    if (!req._id) {
      req._productId = req.body._id || uuidv4(); // can use client productId or generate one
    }
    const productId = req._id || uuidv4();

    // choose subfolder by ext/name
    const ext = path.extname(file.originalname).toLowerCase();
    let subFolder = 'other';
    if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) subFolder = 'images';
    else if (['.glb', '.fbx', '.stl', '.obj', '.blend', '.gltf'].includes(ext)) subFolder = 'model';
    else if (file.originalname.toLowerCase().includes('qr')) subFolder = 'qr';

    const baseFolder = path.join(__dirname, '..', 'product-uploads', productId);
    // create base + all subfolders so structure is predictable
    ensureDir(baseFolder);
    ensureDir(path.join(baseFolder, 'images'));
    ensureDir(path.join(baseFolder, 'model'));
    ensureDir(path.join(baseFolder, 'qr'));
    ensureDir(path.join(baseFolder, 'other'));

    const dest = path.join(baseFolder, subFolder);
    // save a public-ish partial path on the file for later url build
    file.finalPath = `/product-uploads/${productId}/${subFolder}`;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

// Accept named fields
const upload = multer({ storage }).fields([
  { name: 'images', maxCount: 5 }, // front-end: formData.append('images', file)
  { name: 'model', maxCount: 1 },  // front-end: formData.append('model', file)
  { name: 'qr', maxCount: 1 }      // optional if client uploads a QR
]);

// Serve these files statically from Express (in server.js / app.js)
 // app.use('/product-uploads', express.static(path.join(__dirname, 'product-uploads')));

router.post('/new-product', upload, async (req, res) => {
  try {
    // DEBUG: show exactly what multer gave us and the body
    console.log('MULTER FILES:', Object.keys(req.files || {}));
    console.log('REQ.BODY:', req.body);
    Object.entries(req.files || {}).forEach(([k, files]) => {
      files.forEach(f => console.log(k, f.originalname, '=>', f.filename, f.finalPath));
    });

    const buildUrls = (arr = []) => (arr || []).map(f => `${f.finalPath}/${f.filename}`);

    const imageFiles = req.files?.images || [];
    const modelFiles = req.files?.model || [];
    const qrFiles = req.files?.qr || [];

    const imageUrls = buildUrls(imageFiles);
    const modelUrls = buildUrls(modelFiles);
    const uploadedQrUrls = buildUrls(qrFiles);

    const repFile = imageFiles[0] || modelFiles[0] || qrFiles[0] || null;

    // === Robust incoming id detection ===
    // Accept productId (preferred) or _id (alternate). Ignore literal 'undefined' or empty strings.
    const rawId = req.body?.productId ?? req.body?._id ?? null;
    const productId = (typeof rawId === 'string' && rawId !== '' && rawId !== 'undefined') ? rawId : null;

    // Extract other fields from req.body
    const {
      title,
      description,
      metaTitle,
      metaDescription,
      focusKeyword,
      altText,
      tags,
      brands,
      categories,
      price,
      discount,
    } = req.body;

    const tagsArr = tags ? tags.split(',').map(t => t.trim()) : [];
    const brandsArr = brands ? brands.split(',').map(b => b.trim()) : [];
    const categoriesArr = categories ? categories.split(',').map(c => c.trim()) : [];

    let product;

    if (productId) {
      // UPDATE existing product ONLY if it exists
      product = await Media.findById(productId);
      if (!product) {
        // If client sent an id but it doesn't exist, return 404 (safer than creating a new product)
        console.log("Finding product by id:", productId)
        return res.status(404).json({ error: 'Product not found for update', productId });
      }

      // Update fields only if provided (not undefined or empty string)
      if (title !== undefined && title !== '') product.title = title;
      if (description !== undefined && description !== '') product.description = description;
      if (metaTitle !== undefined && metaTitle !== '') product.metaTitle = metaTitle;
      if (metaDescription !== undefined && metaDescription !== '') product.metaDescription = metaDescription;
      if (focusKeyword !== undefined && focusKeyword !== '') product.focusKeyword = focusKeyword;
      if (altText !== undefined && altText !== '') product.altText = altText;
      if (tagsArr !== undefined) product.tags = tagsArr;
      if (brandsArr !== undefined) product.brands = brandsArr;
      if (categoriesArr !== undefined) product.categories = categoriesArr;
      if (price !== undefined && price !== '') product.price = Number(price);
      if (discount !== undefined && discount !== '') product.discount = Number(discount);

      // Update image/model/qr URLs ONLY if new files uploaded
      if (imageUrls.length) product.imageUrls = imageUrls;
      if (modelUrls.length) product.modelUrls = modelUrls;
      if (qrFiles.length) product.qrUrls = uploadedQrUrls;

      // Update main fileUrl only if new image or model uploaded
      if (imageUrls.length) product.fileUrl = imageUrls[0];
      else if (modelUrls.length) product.fileUrl = modelUrls[0];

      await product.save();

    } else {
      // CREATE new product
      req._productId = req._productId || uuidv4();

      product = new Media({
        title,
        description,
        metaTitle,
        metaDescription,
        focusKeyword,
        altText,
        tags: tagsArr || [],
        brands: brandsArr || [],
        categories: categoriesArr || [],
        imageUrls,
        modelUrls,
        qrUrls: uploadedQrUrls,
        price: price ? Number(price) : undefined,
        discount: discount ? Number(discount) : undefined,
        fileType: imageUrls.length ? 'image' : (modelUrls.length ? 'model' : 'other'),
        fileUrl: imageUrls[0] || modelUrls[0] || '',
        uploadedAt: new Date(),
        size: repFile ? repFile.size : undefined,
        mimeType: repFile ? repFile.mimetype : undefined,
      });

      await product.save();

      // Generate QR code only on new product creation if none uploaded
      if (!uploadedQrUrls.length) {
        const APP_URL = process.env.APP_URL || 'http://localhost:5000';
        const productPageUrl = `${APP_URL}/product/${product._id}`;

        // use the persisted product._id as folder id if product.productId is missing
        const pid = product.productId || product._id.toString() || req._productId;

        const qrFolder = path.join(__dirname, '..', 'product-uploads', pid, 'qr');
        ensureDir(qrFolder);
        const qrFilename = `qr-${Date.now()}.png`;
        const qrFilePath = path.join(qrFolder, qrFilename);

        const qrBuffer = await QRCode.toBuffer(productPageUrl, { type: 'png', width: 400 });
        fs.writeFileSync(qrFilePath, qrBuffer);
        const qrPublicUrl = `/product-uploads/${pid}/qr/${qrFilename}`;

        product.qrUrls = [qrPublicUrl];
        await product.save();
      }
    }

    return res.status(productId ? 200 : 201).json(product);

  } catch (err) {
    console.error('Error uploading media or generating QR:', err);
    return res.status(500).json({ error: 'Failed to upload media and metadata', details: err.message });
  }
});

router.get('/retrieve-products', async (req, res) => {
  const { id } = req.query;

  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const product = await Media.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  }

  const products = await Media.find();
  res.json(products);
});

// GET /retrieve-products with menu/tag filtering
router.get('/retrieve-products-filter', async (req, res) => {
  try {
    const {tags, categories, brands, price, sort, search } = req.query;
    const filter = {};
    console.log(req.query)
    // Instead of: filter.tags = tags
    if (tags) {
      filter.tags = { $all: Array.isArray(tags) ? tags : [tags] };
    }
    if (categories) {
      filter.categories = { $all: Array.isArray(categories) ? categories : [categories] };
    }
    if (brands) {
      filter.brands = { $all: Array.isArray(brands) ? brands : [brands] };
    }
    // if (category) filter.categories = category; // if you want categories
    // if (brands) filter.brand = brands;
    
    if (price) {
      if (price.includes('-')) {
        const [min, max] = price.split('-').map(Number);
        filter.price = { $gte: min, $lte: max };
      } else {
        filter.price = Number(price);
      }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Media.find(filter);

    if (sort) {
      const sortOption = {};
      if (sort === 'priceAsc') sortOption.price = 1;
      else if (sort === 'priceDesc') sortOption.price = -1;
      else if (sort === 'newest') sortOption.createdAt = -1;
      query = query.sort(sortOption);
    }

    const products = await query;
    res.json(products);
  } catch (err) {
    console.error('Error fetching filtered products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
