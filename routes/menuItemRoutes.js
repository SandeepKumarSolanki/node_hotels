const express = require('express');
const router = express.Router();

const MenuItem = require('../models/MenuItem');


//POST method to add a MenuItem
router.post('/', async (req, res) => {
    try {
        const data = req.body();
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
        console.log('Menu Item data saved');
        res.status(200).json(response);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error .." })
    }
})

//Get method to get the MenuItem
router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        console.log('MenuItem data fetched')
        res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
})

//Get method Person work Type
router.get('/:tasteType' , async (req , res) => {
    try {
        const tasteType = req.params.tasteType; //Extract the work type from URL parameter

        if(tasteType == 'sweet' || tasteType == 'sour' || tasteType == 'spicy'){
            const response = await MenuItem.find({taste : tasteType});
            console.log("response fetched");
            res.status(200).json(response);
        }else{
            res.status(404).json({error : "Invalid work Type"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error : "Internal Server Error"})
    }
})



//PUT method to update Menu data
router.put('/:id' , async (req , res) => {
    try {
        const menuId = req.params.id; //Extract the id from the URL parameter
        const updateMenuData = req.body; //update data of the person

        const response = await MenuItem.findByIdAndUpdate(menuId,updateMenuData , {
            new : true, //Return the updated document
            runValidators : true //Run Mongoose Validation
        })
        if(!response){
            return res.status(404).json({error : "Menu not found"});
        }

        console.log('data updated');
        res.status(200).json(response);
    } catch (error) {
       console.log(error.message);
       res.status(500).json({error : "Internal Server Error"}); 
    }
})

router.delete('/:id', async (req , res) => {
    try {
        const menuId = req.params.id; //Extract the person's ID front he parameter
        //Assuming you have a person model
        const response = await MenuItem.findByIdAndDelete(menuId);
        if(!response){
            return res.status(404).json({message : "Menu not found"});
        }
        console.log('data delete');
        res.status(200).json({message : 'MenuItem deleted Successfully ...'})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error : "Internal Server Error"});
    }
})

module.exports = router;