const fs = require('fs');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
//using express.json() middleware so that the req object has access to the body property and the data that was
//sent on the request is available for us on the req.body
app.use(express.json());


//before we can send the tours data, we need to first read it from the json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res) => {
  //this callback function is called route handler
  res.status(200).json({
    status: "success",
    /*
    when we are sending multiple responses is to include 
    a field called results with the number of results that we are sending.
    It makes very easy for the client to get very quick information about the data it is receiving.
     */
    results: tours.length,
    data:{
      tours
    }
  })
})
//returning a tour by id url parameters, the variable that we define in the route are url parameters
//they are made available for us in req.params
app.get('/api/v1/tours/:id', (req, res) => {
  //get tour by id
  //first get the id
  const id = req.params.id * 1;
  /*Check if the id is larger than the length of the tours array and if it is longer 
  then we can send back a  404 error saying that we could not find any tour for the given ID. */
  if(id > tours.length){
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id"
    })
  }
  const tour = tours.find(elem => elem.id === id);
 
  res.status(200).json({
    status: "success",
    data:{
      tour
    }
  })
})

//handling patch requests
app.patch('/api/v1/tours/:id', (req, res) => {
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
})

//handling delete requests 
app.delete('/api/v1/tours/:id', (req, res) => {
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
})

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      //we use 201 status code when a new resource is created on the server
      status: "success",
      data: {
        tour: newTour
      }
    })
  })
})
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})