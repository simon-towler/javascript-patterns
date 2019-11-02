//publisher object
var publisher = {

  subscribers: {
    any: []
  },

  on: function (eventType, handler, context) {//subscribe
    eventType = eventType || 'any';//providing default value
    handler = typeof handler === "function" ? handler : context[handler];//?

    if (typeof this.subscribers[eventType] === "undefined") {
      this.subscribers[eventType] = [];//define previously unknown event types
    }

    this.subscribers[eventType].push(
      {handler: handler, context: context || this}
    );
  },

  remove: function (eventType, handler, context){//unsubscribe
    this.visitSubscribers('unsubscribe', eventType, handler, context);
  },

  fire: function (eventType, publication) {//publish
    this.visitSubscribers('publish', eventType, publication);
  },

  visitSubscribers: function (action, eventType, arg, context) {
    var pubtype = eventType || 'any',
    subscribers = this.subscribers[pubtype],
    i,
    max = subscribers ? subscribers.length : 0;

    for (i=0, i < max; i += 1) {
      if (action === 'publish') {
        subscribers[i].handler.call(subscribers[i].context, arg);
      } else {
        if (subscribers[i].handler === arg
          && subscribers[i].context === context) {
            subscribers.splice(i, 1);
        }
      }
    }
  }
};

//Player constructor
function Player(name, key) {
  this.points = 0;
  this.name = name;
  this.key = key;
  this.fire('newplayer', this);
}

Player.prototype.play = function () {
  this.points += 1;
  this.fire('play', this);
};
