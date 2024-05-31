const fs = require('fs');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
//using express.json() middleware so that the req object has access to the body property and the data that was
//sent on the request is available for us on the req.body
app.use(express.json());

//when we write app.use(here pass the function) then this function is added to the middleware stack


//we have defined this middleware here so it will be accessible to all the routes that are defined after it.
//If we define this after a route, then this middleware won't execute because the routeHandler for a certain
//route or endpoint would already have ended the request-response cycle by sending a response
app.use((req, res, next) => {
  console.log('Hello from the Middleware!');
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

//read the data from the JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//Refactoring our routes
//Separating all the route handlers function together and all the routes together from each other
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data:{
      tours
    }
  })
}

const getTour = (req, res) => {
  const id = (req.params.id) * 1;
  if(id > tours.length){
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }
  const tour = tours.find(elem => elem.id === id);
  
  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  })
}


const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      //we use 201 status code when a new resource is created on the server
      status: "success",
      data: {
        tour: newTour,
        requestedAt: req.requestTime
      }
    })
  })
}

const updateTour = (req, res) => {
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }

  res.status(200).json({
    status: "success",
    message: "<Updated tour here>"
  })
}

const deleteTour = (req, res) => {
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id"
    })
  }

  res.status(204).json({
    //204 status code means no content
    status: "success",
    data: null
  })
}

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//better way
app
.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app
.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);


app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})