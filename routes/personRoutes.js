const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const {jwtAuthMiddleware , generateToken} = require('../jwt')

//POST route to add new person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        
        // Create a new Person document using the mongoose model
        const newPerson = new Person(data);

        // Save the new person to the database
        const response = await newPerson.save();
        console.log('Data saved');

        // Create a payload to send in the JWT
        const payload = {
            id: response.id,
            username: response.username
        };

        console.log(JSON.stringify(payload));

        // Generate JWT token
        const token = generateToken(payload);
        console.log("Token is: ", token);

        // Send response with the new person and token
        res.status(200).json({ response: response, token: token });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



//Login Route

router.post('/login' , async (req , res) => {
    try {
        //Extract username and password from request body
        const {username , password} = req.body;

        //Find the user by username
        const user = await Person.findOne({username : username});

        //If user does not exists or password does not match , return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(404).json({error : 'Invalid username or password'});
        }

        //generate Token
        const payload = {
            id : user.id,
            username : user.username
        }
        
        const token = generateToken(payload);;

        //return token as response
        res.json({token});

    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Internal Server Error'});
    }
})

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Get person detail
router.get('/' ,jwtAuthMiddleware ,  async (req, res) => {
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
        res.status(500).json({error : "Internal Server Error"})
    }
})

module.exports = router;