const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const prompt = require('prompt-sync')();

// Connect to MongoDB
mongoose.connect('mongodb+srv://meghanas:siddukala23@cluster0.2iaylmq.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create Animal schema
const animalSchema = new Schema({
  name: String,
  lifespan: Number,
  age: Number,
});

// Create Animal model
const Animal = mongoose.model('Animal', animalSchema);

// Create Express app
const app = express();
app.use(express.json());

// Define API routes
app.post('/animals', async (req, res) => {
  try {
    const { name, lifespan, age } = req.body;
    const animal = new Animal({ name, lifespan, age });
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

app.get('/animals', async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve animals' });
  }
});


app.get('/animals/alive', async (req, res) => {
  try {
    const years = parseInt(prompt('Enter the number of years: '));
    const animals = await Animal.find({ age: { $lt: years } });
    const aliveAnimalCount = animals.length;
    console.log(`Number of animals alive after ${years} years: ${aliveAnimalCount}`);
    res.json({ count: aliveAnimalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve alive animals' });
  }
});


// Create animal from user input
app.post('/create-animal', async (req, res) => {
  try {
    const name = prompt('Enter the name of the animal: ');
    const lifespan = parseInt(prompt(`Enter the lifespan of ${name}: `));
    const age = parseInt(prompt(`Enter the age of ${name}: `));
    const animal = new Animal({ name, lifespan, age });
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});