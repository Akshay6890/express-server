const express = require('express')
const fs = require('fs')
const app = express();
var bodyParser=require("body-parser");
const port=3000;


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.json({extended: false}))


app.get('/posts/view/',(req,res)=>{

    fs.readFile("db.json",(err,data)=>{
        if(err) throw err
		data=JSON.parse(data)
		/*d=data["blogs"]*/
        return res.json(data)
    });

})

app.get('/posts/view/:id',(req,res)=>{

    const id = req.params.id 
    //console.log("ID :",id)
    fs.readFile("db.json",(err,data)=>{
        if(err) throw err
        let result = {}
        
		data=JSON.parse(data)
		
        data["blogs"].forEach(post=>{
            if(post.id==id) {
                result = post;
				console.log(result);
            }
        })
        return res.json(result)
    });
    
})

app.post('/posts/create/',(req,res)=>{

    let contents = fs.readFileSync('db.json', 'utf8');

    const data = JSON.parse(contents);
	
	var counter = fs.readFileSync('counter.txt', 'utf-8');
	
	counter=Number(counter);

    const toAdd = {
            "title": req.body.title, // replace this value with req.body.title
            "author": req.body.author, // replace this value with req.body.author 
            "body": req.body.content, // replace this value with req.body.content
            "id": counter // replace this value with req.body.id
    }
	
	counter+=1;
	
	fs.writeFileSync('counter.txt',String(counter));

    /*
        Now from POSTMAN 
        You pass this data in this format
        {
            "title":"...",
            "author":"...",
            "content":"...",
            "id":"..."
        }
    */
    data["blogs"].push(toAdd);

    try {
        fs.writeFileSync('db.json', JSON.stringify(data))
      } catch (err) {
        console.error(err)
      }

    return res.json(data)
})


app.put('/posts/update/:id',(req,res)=>{

    let contents = fs.readFileSync('db.json', 'utf8');
    let id = req.params.id
    const data = JSON.parse(contents)

    const toUpdate = {
        "title": req.body.title, // replace this value with req.body.title
        "author": req.body.author, // replace this value with req.body.author 
        "body": req.body.content, // replace this value with req.body.content
        "id": id // replace this value with req.body.id FOR UPDATE IM KEEPING EXISTING ID to SEE IF IT CHANGED
    }

      /*
        Now from POSTMAN 
        You pass this data in this format
        {
            "title":"...",
            "author":"...",
            "content":"...",
            "id":"..." // keep existing it to update that record
        }
    */
    
    const idx = data["blogs"].findIndex((obj=>obj.id==id))
    
    data["blogs"][idx] = toUpdate
    
    console.log(data)
    try {
        fs.writeFileSync('db.json', JSON.stringify(data))
      } catch (err) {
        console.error(err)
      }

    return res.json(data)
})


app.delete('/posts/delete/:id',(req,res)=>{

    let contents = fs.readFileSync('db.json', 'utf8');
    const ID = req.params.id;
    const data = JSON.parse(contents);

    data["blogs"] = data["blogs"].filter( (post) => {
        return post.id != ID;
      });
	  
	//delete data["blogs"][ID];
    
    //console.log(data["blogs"])

    try {
        fs.writeFileSync('db.json', JSON.stringify(data))
      } catch (err) {
        console.error(err)
      }
    return res.json(data);
})


app.listen(process.env.PORT || port)


