const cars = [{
  id: '1',
  brand: 'Toyota',
  model: 'Corolla'
},
{ 
  id: '2',
  brand: 'Tesla',
  model: 'Model 3'
},{
  id: '3',
  brand: 'McLaren',
  model: 'F1',
  acceleration: 20
}];



export class Car {
  #id;
  #brand;
  #model;
  #speed;
  isTrunkOpen;
  constructor(carDetails){
    this.#id = carDetails.id;
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
    this.#speed = 0;
    this.isTrunkOpen = false;
  };
  displayInfo(){
    const trunckStatus = this.isTrunkOpen ? 'open' : 'closed'

    console.log(`Brand: ${this.#brand}, Model: ${this.#model}, Speed: ${this.#speed}, trunk is ${trunckStatus}`);
  };
  go(){
    if(this.isTrunkOpen === true){
      this.#speed = 0
    } else if(this.#speed < 200){
        this.#speed +=5;
  }};
  brake(){
    if(this.#speed > 0){
      this.#speed -=5;
  }};
  openTrunk(){
    if(this.isTrunkOpen === false){
      this.isTrunkOpen  = true
  }}; 
  closeTrunk(){
    if(this.isTrunkOpen === true){
      this.isTrunkOpen  = false
    };
}};

export class RaceCar extends Car{
  #acceleration;
  
  constructor(carDetails){
    super(carDetails)
    this.#acceleration = carDetails.acceleration;
  }

  go(){
    if(this.speed < 300){
        this.speed += this.#acceleration;
  }};

  openTrunk() {
    console.log('Race cars do not have a trunk');
  };

  closeTrunk() {
    console.log('Race cars do not have a trunk');
  };
};
 

const car1 = new Car(cars[0]);
const car2 = new Car(cars[1]);
const car3 = new RaceCar(cars[2]);



car1.closeTrunk();
car1.openTrunk();

car3.openTrunk();



car1.go();
car1.go();
car2.go();

car2.brake();
car2.go();
car3.go();

car1.displayInfo();
car2.displayInfo();
car3.displayInfo();
/*const carObjects = cars.map((car) => {
  return new Car(car)
});

console.log(carObjects)
*/ 
