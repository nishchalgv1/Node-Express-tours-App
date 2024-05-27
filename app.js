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