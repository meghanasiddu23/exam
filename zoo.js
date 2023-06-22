const prompt = require('prompt-sync')();

class Animal {
  constructor(name, lifespan) {
    this.name = name;
    this.lifespan = lifespan;
    this.isAlive = true;
  }

  getRemainingYears(years) {
    if (this.isAlive) {
      const remainingYears = this.lifespan - years;
      if (remainingYears <= 0) {
        this.isAlive = false;
        return 0;
      } else {
        return remainingYears;
      }
    } else {
      return 0;
    }
  }
}

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
      const remainingYears = animal.getRemainingYears(years);
      if (remainingYears > 0) {
        aliveAnimals.push(animal);
      }
    }
    return aliveAnimals;
  }
}

const main = () => {
  const zoo = new Zoo();
  const n = parseInt(prompt('Enter the number of zoo animals: '));

  for (let i = 0; i < n; i++) {
    console.log(`Animal ${i + 1}`);
    const name = prompt("Enter the animal's name: ");
    const lifespan = parseInt(prompt("Enter the animal's lifespan: "));
    zoo.addAnimal(new Animal(name, lifespan));
  }

  const years = parseInt(prompt('Enter the number of years: '));
  const aliveAnimals = zoo.getAliveAnimals(years);

  console.log(`After ${years} years, ${aliveAnimals.length} animals will be alive.`);
};

main();