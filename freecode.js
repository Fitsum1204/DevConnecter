const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

const userSchema = new mongoose.Schema({
    username: { 
      type: String, 
      required: true, 
      unique: true }
    // Ensures unique URLs
    
  });
  
  const Person  = mongoose.model('person', userSchema);

  const exercisesSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true 
    },
    description: { 
            type: String, 
            required: true 
             },
      duration: { 
            type: Number, 
            required: true 
            }, 
     date: { 
          type: Date, 
          default: Date.now,
           }
   
    
  });
  
  const EX  = mongoose.model('ex', exercisesSchema );


app.use(cors())
app.use(express.json({extended: false}));
app.use( bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
/* const checkUserId = (req, res, next) => {
  if (!req.params._id) {
    return res.status(400).json({ error: 'Missing user ID in request URL' });
  }
  next(); // If ID is present, continue to the route handler
}; */

app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  console.log(username );

   if (!username ) { // Check if it exists
     return res.status(400).json({ error: 'Username is required' }); // Handle error
   }
try {
  const newPerson = new Person (
    {username: username}
   );
   console.log(newPerson);
   if(newPerson) {
    try {
      const existingPerson = await Person.findOne({ username: newPerson.username});
      if (!existingPerson) {
      
        newPerson.save()
        .then(() =>{console.log("success")})
        .catch(error => {
          console.error(error); // Handle other errors
        });
        res.json(newPerson);
      } else {
        console.log("caught")
        // If found, return the existing short code
        res.json( existingPerson );
      }
    
    
    } catch (err) {
      console.error(err);
      return res.json({ error: "Internal server error" }); // More specific error handling
      
    }
   }
  
} catch (error) {
  res.json({ error:'invalid person' });
    return; // Exit the function if URL is invalid
  
}

      
});

app.get('/api/users', async (req,res) => {
  try{
    const profiles = (await Person.find());
    res.json(profiles);
} catch(err) {
    console.error(err.message);
    res.status(500).send('server error')  
}
 
})



/* const checkUserId = (req, res, next) => {
  if (!req.params._id) {
    return res.status(400).json({ error: 'Missing user ID in request URL' });
  }
  next(); // If ID is present, continue to the route handler
};
 */
app.post('/api/users/:_id/exercises', async (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body; // Destructuring for cleaner code

  // Input validation (optional but recommended)
  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' });
  }

  try {
    // Find the user by ID (assuming a unique user ID)
    const user = await Person.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new exercise object with appropriate data types
    const newExercise = new EX({
      user: user._id, // Use the actual user reference (recommended)
      description,
      duration,
      date: date ? new Date(date) : new Date() // Handle optional date with conversion
    });

    // Save the new exercise and send a response with populated user data
    await newExercise.save();
    const populatedExercise = await EX.findById(newExercise._id).populate('person', 'username');

    res.json({
      _id: populatedExercise._id,
      username: populatedExercise.person.username,
      description: populatedExercise.description,
      duration: populatedExercise.duration,
      date: populatedExercise.date.toDateString() // Consistent date formatting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); // Generic error for now
  }
});

// ... other routes and server startup logic (same as before)



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
