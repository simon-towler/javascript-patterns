//generic publisher functionality

var publisher = {


    subscribers: {
      any: [] // event type: subscribers
    },

    //subscribe to an event type and provide a function to do
    subscribe: function (fn, type) {
      type = type || 'any'; // provides default value 'any'

      //if the type of event being subscribed to not yet held, create it
      if (typeof this.subscribers[type] === "undefined") {
        this.subscribers[type] = [];
      }

      //push the given function onto the array for its type in subscribers
      this.subscribers[type].push(fn);
      console.log("publisher.subscribe was called.");
    },


    //unsubscribe from events of a given type, providing a function to do
    unsubscribe: function (fn, type) {
      this.visitSubscribers('unsubscribe', fn, type);
      console.log("publisher.unsubscribe was called.");
    },


    //publish a publication of a given type to subscribers
    publish: function (publication, type) {
      console.log("publisher.publish called.");
      this.visitSubscribers('publish', publication, type);
      console.log("publisher.publish was called.");
    },

    //visit all subscribers of a given type, doing the given action (publish/unsubscribe)
    visitSubscribers: function (action, arg, type) {
      console.log("publisher.visitSubscribers called.");
      var pubtype = type || 'any',//provide default pubtype 'any'
          subscribers = this.subscribers[pubtype],//only subscribers to the given event type
          i,
          max = subscribers.length;

      for (i = 0; i < max; i += 1) {
        if (action === 'publish') {
            //pass the argument into the function provided by the subscriber at index i
          subscribers[i](arg);
        } else {//if we're not publishing, we must be unsubscribing, so...
            if (subscribers[i] === arg) {//id the unsubscriber by the func it provided
                //remove the function provided by the subscriber at index i
              subscribers.splice(i, 1);
            }
        }
      }
      console.log("publisher.visitSubscribers was called.");
    }


};//end publisher


/* function that takes an object and turns it into a publisher
by simply copying over the generic publisher's methods */
function makePublisher(o) {
  var i;
  for (i in publisher) {
      if (publisher.hasOwnProperty(i) && typeof publisher[i] === 'function') {
          o[i] = publisher[i];
      }
  }
  o.subscribers = {any: []};//initialize subscribers on new publisher o
  console.log("makePublisher was called");
}

// MAIN ROUTINE

// implement a paper object that can publish daily and monthly
var paper = {
  daily: function () {
    this.publish("big news today");
    console.log("paper.publish daily was called.");
  },
  monthly: function () {
    this.publish("interesting analysis", "monthly");
    console.log("paper.publish monthly was called.");
  }
};
console.log("instantiating a paper object having functions daily and monthly.");

//make paper a publisher
console.info("Making paper a publisher.");
makePublisher(paper);


//subscriber object, joe
console.info("Instantiating new subscriber joe.");
var joe = {
  drinkCoffee: function (paper) {
    console.log('Just read ' + paper);
  },
  sundayPreNap: function (monthly) {
    console.log('About to fall asleep reading this ' + monthly);
  }
};


//subscribe joe to the paper
console.info("subsribing joe.drinkCoffee to paper.");
paper.subscribe(joe.drinkCoffee);//provide a method for default 'any' event
console.info("subscribing joe.sundayPrenap to monthly paper.");
paper.subscribe(joe.sundayPreNap, 'monthly');

//fire some events
console.info("Firing paper.daily");
paper.daily();
console.info("Firing paper.daily");
paper.daily();
console.info("Firing paper.daily");
paper.daily();
console.info("Firing paper.monthly");
paper.monthly();
