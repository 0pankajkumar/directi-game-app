
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const path = require('path');
const router = express.Router();

//var fs = require('fs')




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

        //Connecting to postgres on heroku
        const { Client } = require('pg');
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: true,
        });
        client.connect();
        //postgres connected
        
        var a = req.param('email');
        var b = req.param('name');
        var c = (req.query.score);
        
        console.log(typeof(c));
        
        client.query("INSERT INTO public.topscore(email,name,score) VALUES ($1, $2, $3);", [a,b,c], (err, response) => {
        if (err) throw err;
          
          //client.end();
          //res.status(200).send();
          
          
            
            //res.end();
        });
        
        

        //res.writeHead(200, {'Content-Type': 'text/plain'});
        
        client.query('select email,name,max(score) from public.topscore group by email,name;', (err, response) => {
        if (err) throw err;
          for (let row of response.rows) {
            console.log(JSON.stringify(row));
            //res.write(JSON.stringify(row, null, "    ") + "\n");
          }
          
          client.end();
          res.status(200).send(response.rows);
          
          
            
            //res.end();
        });
        
        
        
        
        
/*
        var query = client.query("select email,name,max(score) from topscore group by email,name;");

        query.on("row", function (row, result) { 
            result.addRow(row); 
        });

        query.on("end", function (result) {          
            client.end();
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
            res.end();  
        });
    
*/
    //res.send("How shall I send data to client?");
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