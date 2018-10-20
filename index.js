var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Create queues for abortion
var abortionForQueue = [];
var abortionAgaQueue = [];
var abortionNeuQueue = [];

// Create queues for gun_control
var gunForQueue = [];
var gunAgaQueue = [];
var gunNeuQueue = [];

// Function for removing exited users
function deleteArrayElement(array, value) {
  var i = 0;
  while (i < array.length) { 
     if ( array[i] == value) {
       array.splice(i, 1); 
     }
     i ++; 
  }
}  

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    getNum(topic: String!, side: String!): String,
    delNum(topic: String!, side: String!, room: String!): String,
    displayQueue: [[String]]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  getNum: function ({topic, side}) {
    var output = '';
    // Abortion
    if (topic == 'abortion') {
      if (side == 'pro_life') {
        if (abortionForQueue.length != 0) {
          output = abortionForQueue.pop();
        } else {
          var newUser = Math.random().toString().slice(2);
          abortionAgaQueue.unshift(newUser);
          output = newUser;
        }
      } else if (side == 'pro_choice') {
        if (abortionAgaQueue.length != 0) {
          output = abortionAgaQueue.pop();
        } else {
          var newUser = Math.random().toString().slice(2);
          abortionForQueue.unshift(newUser);
          output = newUser;
        }
      } else {
        console.log('getNum error');
      }
    // Gun Control
    } else if (topic == 'gun_control') {
      if (side == 'for') {
        if (gunAgaQueue.length != 0) {
          output = gunAgaQueue.pop();
        } else {
          var newUser = Math.random().toString().slice(2);
          gunForQueue.unshift(newUser);
          output = newUser;
        }
      } else if (side == 'against') {
        if (gunForQueue != 0) {
          output = gunForQueue.pop();
        } else {
          var newUser = Math.random().toString().slice(2);
          gunAgaQueue.unshift(newUser);
          output = newUser;
        }
      } else {
        console.log('getNum error');
      }
    } else {
      console.log('getNum error');
    }
    return output; 
  },

  delNum: function ({topic, side, room}) {
    var output = ''
    // Abortion
    if (topic == 'abortion') {
      if (side == 'pro_life') {
        if (abortionAgaQueue.includes(room)) {
          deleteArrayElement(abortionAgaQueue, room);
          output = "Room was deleted.";
        } else {
          output = "User was already paired."
        }
      } else if (side == 'pro_choice') {
        if (abortionForQueue.includes(room)) {
          deleteArrayElement(abortionForQueue, room);
          output = "Room was deleted.";
        } else {
          output = "User was already paired."
        }
      } else {
        console.log('delNum error');
      }
    // Gun Control
    } else if (topic == 'gun_control') {
      if (side == 'for') {
        if (gunForQueue.includes(room)) {
          deleteArrayElement(gunForQueue, room);
          output = "Room was deleted.";
        } else {
          output = "User was already paired."
        }
      } else if (side == 'against') {
        if (gunAgaQueue.includes(room)) {
          deleteArrayElement(gunAgaQueue, room);
          output = "Room was deleted.";
        } else {
          output = "User was already paired."
        }
      } else {
        console.log('delNum error');
      }
    } else {
      console.log('delNum error');
    }
    return output;
  },

  displayQueue: function() {
    return [abortionForQueue, abortionAgaQueue, gunForQueue, gunAgaQueue];
  }
}

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));

app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https')
    res.redirect(`https://${req.header('host')}${req.url}`)
  else
    next()
});

app.get('/', function(req, res) {
  res.render('index.html');
})

app.use('/api', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, function() {
  console.log(`Can Opener server running on port ${port}`);
})