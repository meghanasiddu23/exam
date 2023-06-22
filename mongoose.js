const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Animal Schema
const animalSchema = new mongoose.Schema({
  name: String,
  lifespan: Number,
});

// Animal model
const Animal = mongoose.model('Animal', animalSchema);

class Zoo {
  constructor() {
    this.animals = [];
  }

  addAnimal(animal) {
    this.animals.push(animal);
  }

  getAliveAnimals(years) {
    const aliveAnimals = [];
    for (const animal of this.animals) {
      const remainingYears = animal.lifespan - years;
      if (remainingYears > 0) {
        aliveAnimals.push(animal);
      }
    }
    return aliveAnimals;
  }
}

async function connectToDatabase() {
  try {
    const uri = 'mongodb+srv://meghanas:siddukala23@cluster0.2iaylmq.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

async function saveAnimalsToDatabase(animals) {
  try {
    await Animal.insertMany(animals);

    console.log('Animals saved to MongoDB successfully.');
  } catch (error) {
    console.error('Error saving animals to MongoDB:', error);
  }
}

async function readAnimalsFromDatabase() {
  try {
    const animals = await Animal.find();
    return animals;
  } catch (error) {
    console.error('Error reading animals from MongoDB:', error);
    return [];
  }
}

async function main() {
  const zoo = new Zoo();

  const numberOfAnimals = parseInt(prompt("Enter the number of animals in the zoo:"));

  for (let i = 0; i < numberOfAnimals; i++) {
    const animalName = prompt(`Enter the name of animal ${i + 1}:`);
    const lifespan = parseInt(prompt(`Enter the lifespan of animal ${i + 1}:`));

    const animal = new Animal({ name: animalName, lifespan });
    zoo.addAnimal(animal);
  }

  const years = parseInt(prompt("Enter the number of years:"));
  const aliveAnimals = zoo.getAliveAnimals(years);

  console.log(`After ${years} years, ${aliveAnimals.length} animals will be alive.`);

  await connectToDatabase();

  await saveAnimalsToDatabase(zoo.animals);

  const animalsFromDB = await readAnimalsFromDatabase();
  console.log('Animals retrieved from MongoDB:', animalsFromDB);

  await mongoose.disconnect();
}

main();
