const express = require('express');

//Import person models
const Person = require('../models/Person');
const router = express.Router();






//POST route to add new person
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        //Create a new Person document using mongoose model
        const newPerson = new Person(data);

        //save the new person to the database
        const response = await newPerson.save();
        console.log('data saved succesfully..', response);
        res.status(200).json(response);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//Get person detail
router.get('/', async (req, res) => {
    try {
        const data = await Person.find();
        console.log("data fetched");
        res.status(200).json(data)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
})


//Get method Person work Type
router.get('/:workType' , async (req , res) => {
    try {
        const workType = req.params.workType; //Extract the work type from URL parameter

        if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){
            const response = await Person.find({work : workType});
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


//PUT method to update person data
router.put('/:id' , async (req , res) => {
    try {
        const personId = req.params.id; //Extract the id from the URL parameter
        const updatePersonData = req.body; //update data of the person

        const response = await Person.findByIdAndUpdate(personId,updatePersonData , {
            new : true, //Return the updated document
            runValidators : true //Run Mongoose Validation
        })
        if(!response){
            return res.status(404).json({error : "Person not found"});
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
        const personId = req.params.id; //Extract the person's ID front he parameter
        //Assuming you have a person model
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error : "Person not found"});
        }
        console.log('data delete');
        res.status(200).json({message : 'Person deleted Successfully ...'})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error : "Internal Server Error"});
    }
})

module.exports = router;