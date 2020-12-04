const express = require('express')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const app = express();

var jsonParser = bodyParser.json()

//admin db is used here because its mandatory for replica set status retrival.
mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/admin',{ useNewUrlParser:true,useUnifiedTopology: true});


var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    console.log("h1");
    db.once('open', function callback () {
        console.log(db.name);
    });


var hjdb = mongoose.createConnection('mongodb://localhost:27017,localhost:27018,localhost:27019/HJDB',{ useNewUrlParser:true,useUnifiedTopology: true});
    hjdb.on('error', console.error.bind(console, 'connection error:'));
    console.log("h1");
    hjdb.once('open', function callback () {
        console.log(hjdb.name);
    });
//returns json object containing serverstatus and replica set status together.
// But Replica status is returning null for some reason after following the documentation.

app.post('/',(req,res)=>{

    //req validation code goes here

    if(db.readyState==1){
        let json = {}
        //retriving server status
        db.db.command( { serverStatus: 1 } ,(err,result)=>{
            console.log(result);
            json["ServerStatus"] = result;
            //retriving replica set status
            db.db.command({replSetGetStatus:1}, (err,result=>{
                console.log(result);
                json["ReplicaSetStatus"] = result;
                res.send(json);
                res.end("DB connected");
            }))
            
        })
        
        
    }
    else if(db.readyState==0){
        res.end("DB disconnected");
    }
    else if(db.readyState==2){
        res.end("DB connecting");
    }
    else{
        res.end("DB disconnecting");
    }
})


//api 2 to get incomplete haikyu
app.get('/incomplete',(req,res)=>{
    if(hjdb.readyState==1){
        const schema = new mongoose.Schema({ haiku: 'string', isCompleted: 'boolean' });
        const Haiku = hjdb.model('Haiku', schema,"Haiku");

        //this if is removable since we will have some data in actual use case. 
        //added this to show the code works.
        let count=0;

        Haiku.countDocuments((err,cnt)=>{
            if(err){
                throw err;
            }
            count=cnt;
        })
        console.log("count of haikus ",count,Haiku.name);
        if(count==0){
            //adding dummy haikus
            
            for(let i=0 ;i< 5;i++){
                
                if(i==0)
                {
                    let doc = new Haiku({haiku:"little monkey",isCompleted:false});
                    doc.save().then((doc)=>{
                        console.log("saved "+i,doc)
                        //saved
                    });
                }
                else{
                    let doc = new Haiku({haiku:(i+1)+"little monkey",isCompleted:true});
                    doc.save().then((doc)=>{
                        console.log("saved "+i,doc)
                        //saved
                    });
                }
            }
        }
        
        Haiku.findOne({isCompleted:false},(err,doc)=>{
            if(err){
                console.log(err);
                res.end("error occured while retriving data")
            }
            if(doc.$isEmpty()||doc==null){
                res.send({haikyu:"",isCompleted:false})
            }
            res.send(doc.toJSON());
        });
        
    }
    else if(hjdb.readyState==0){
        res.end("hjdb disconnected");
    }
    else if(hjdb.readyState==2){
        res.end("hjdb connecting");
    }
    else{
        res.end("hjdb disconnecting");
    }
});

//api 3 to write over an haikyu assuming object id known.
app.post("/writeon",jsonParser,(req,res)=>{
    console.log(req.body);
    let objectId = req.body.objectId;
    let newHaiku = req.body.newHaiku;
    let newIsCompleted = req.body.newIsCompleted;
    
    if(objectId==null){
        res.end("send proper id");
    }
    const schema = new mongoose.Schema({ haiku: 'string', isCompleted: 'boolean' });
    const Haiku = hjdb.model('Haiku', schema,"Haiku");

    Haiku.updateOne({_id:objectId}, {haiku:newHaiku, isCompleted: newIsCompleted},(err,doc)=>{
        if(err){
            throw err;
        }
        res.end("Update Sucessful");
    })

})




app.listen(3000,()=>{
    console.log("listning on port 3000.")
})