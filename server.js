var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;

var config= {
  user:'bhavins97',
  database:'bhavins97',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password: process.env.DB_PASSWORD
    
};

var app = express();
app.use(morgan('combined'));


var articles={
    'article-one' :{
  title: 'Article One: Bhavin Shah',
  heading: 'Article One',
  date: 'Sep 29, 2016',
  content:` 
            <p>
                This is the content for my first article.
            </p>
            <p>
                I am new to this.
            </p>
            <p>
                This is a lot of fun to do.
            </p>`
},
    'article-two' :{
        title: 'Article Two: Bhavin Shah',
        heading: 'Article Two',
        date: 'Sep 30, 2016',
        content:` 
            <p>
                This is the content for my second article.
            </p>
            <p>
                I am enjoying this course.
            </p>
            <p>
                This is a lot of fun to do.
            </p>`
    },
    'article-three' :{
        title: 'Article Three: Bhavin Shah',
        heading: 'Article Three',
        date: 'Sep 30, 2016',
        content:` 
            <p>
                This is the content for my third article.
            </p>
            <p>
                I am getting familiar to this.
            </p>
            <p>
                This is a lot of fun to do.
            </p>`
    },
};

function createTemp(data) {
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;
    var htmlTemp = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width-device-width, initial-scale-1" />  
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href='/'>Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
                </div>
                <div>
                    ${content}
                </div>
            </div>
    
        </body>
    </html>
    `;
    return htmlTemp;
}




app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {

    //make a select request
    //return a response with the results
    pool.query('SELECT * FROM test', function(err, result){
       if (err){
           res.status(500).send(err.toString());
       }
       else{
           res.send(JSON.stringify(result.rows));
       }
       
    });
    
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var counter = 0;
app.get('/counter', function(req,res){
   counter=counter+1;
   res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req,res){ //URL:/submit-name?name=xxxx
   //get the name from the request object
   
   var name= req.query.name;
   names.push(name);
   //JSON: JavaScript Object Notation
   
   res.send(JSON.stringify(names));
    
});


app.get('/articles/:articleName', function (req,res){
    
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName +"'", function(err, result){
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           if(result.rows.length===0){
               res.status(404).send('Article Not Found');
           }
           else{
               articleData=results.rows[0];
               res.send(createTemp(articleData));
           }
       }
        
    });  
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});




var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
