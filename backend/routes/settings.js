const express = require('express');
const {v4 : uuidv4} = require('uuid');
const Setting = require('../models/settings');
const mongoose = require('mongoose');
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post('/product-settings',
  upload.none(),
  async (req, res) => {  
    try {
    
    const { brands, categories, tags } = req.body;
    const brandsArr = brands ? brands.split(',').map(b => b.trim()) : [];
    const categoriesArr = categories ? categories.split(',').map(c => c.trim()) : [];
    const tagsArr = tags ? tags.split(',').map(t => t.trim()) : []; 

    // check if one already exists
    let productSettings = await Setting.findOne();
      if (productSettings) {
        // update existing
        if(brands && brandsArr.length) {
           productSettings.brands = [...new Set([...(productSettings.brands || []), ...brandsArr])];
        }
        if (categories && categoriesArr.length) {
            productSettings.categories = [...new Set ([...(productSettings.categories || []), ...categoriesArr])];
        }

        if (tags && tagsArr.length){
            productSettings.tags = [...new Set([...(productSettings.tags || []), ...tagsArr])];
        }
        productSettings.updated = new Date();
  
        await productSettings.save();
        return res.status(200).json(productSettings);
      } else {
        // create new
        productSettings = new Setting({
          brands: brandsArr,
          categories: categoriesArr,
          tags: tagsArr
        });
        await productSettings.save();
        return res.status(201).json(productSettings);
      }
    } catch (err) {
      console.error('Error creating/updating settings:', err);
      return res.status(500).json({ error: 'Failed to create/update settings' });
    }
});

    router.get('/retrieve-settings', async (req, res) => {
        const { id } = req.query;

        if(id) {
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({error: 'Invalid settings ID'});
            }

            const productSettings = await settings.findById(id);
            if(!productSettings){
                return res.status(404).json({ error: 'Settings not found' });
            }
            return res.json(productSettings);
        }

        const productSettings = await Setting.find();
        res.json(productSettings);
    })

    module.exports = router;