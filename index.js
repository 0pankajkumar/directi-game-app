
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const path = require('path');
const router = express.Router();

//var fs = require('fs')

//Connecting to postgres on heroku
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();
//postgres connected



router.get('/index.html',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to your project folder.
});

//add the router
app.use('/', router);


//to serve static files
app.use(express.static('public'))



app.get('/insertI', function (req, res) { 

var writeBuff;
/*

    
    //Writing user data in JSON file
    fs.readFile('./users.json', 'utf-8', function(err, data) {
	if (err) throw err

	var arrayOfObjects = JSON.parse(data)
	arrayOfObjects.users.push({
		name: req.param('name'),
		score: req.param('score')
	})

	console.log(arrayOfObjects)
    
    writeBuff = (arrayOfObjects);

	fs.writeFile('./users.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
		if (err) throw err
		console.log('Done!')
	})
})
*/

    client.query('select email,name,max(score) from topscore group by email,name;', (error, response) => {
      if (error) throw error;
      var row;
      for (row of response.rows) {
        console.log(JSON.stringify(row));
        console.log(typeof(row));
      }
      writeBuff = response.rows;
      client.end();
    });
    
    res.send("How shall I send data to client?");
    //res.send(JSON.stringify(arrayOfObjects));
    
})

app.post('/checkI', function (req, res) {
  res.send('Got a POST request')
})

app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
})

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})  

app.listen(port, () => console.log(`Example app listening on port ${port}!`))