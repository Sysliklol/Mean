/**
 * Created by Валера on 05.03.2018.
 */
let express = require("express");
let path = require("path");
let session = require('express-session');
let bodyParser = require("body-parser");
let passport = require('passport');


let user = require('./Node/user');
/*let purchase = require('./Node/purchase');
let income = require('./Node/income');*/
let transaction = require('./Node/transaction')
let place = require('./Node/place')

let app = express();
let router = express.Router();
let sessions;


app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use('/api',router);

router.route('/user')
    .get((req,res) => {
        user.getUser(sessions.username,result => {
            if(result){

                res.json(result.name);
            }
            else{
                res.send("Username");
            }
        })

    });



/*router.route('/userPurchase/')
    .get((req,res) => {
        let userId = sessions.username;

        purchase.getUserPurchase(userId,result =>{
            if(result){
                res.send(result);
            }
            else{
                res.send("nothing found");
            }
        })
    });

router.route('/userIncome/')
    .get((req,res) => {
        let userId = sessions.username;

        income.getIncomes(userId,result =>{
            if(result){
                res.send(result);
            }
            else{
                res.send("nothing found");
            }
        })
    })


router.route('/purchase/:purchaseId')
    .get((req,res) => {
        let purchaseId = req.params.purchaseId;

        purchase.getPurchaseById(purchaseId, result => res.send(result));
    });

router.route('/income/:incomeId')
    .get((req,res) => {
        let incomeId = req.params.incomeId;

        income.getIncomeById(incomeId, result => res.send(result));
    });

router.route('/addPurchase/')
    .post((req,res) => {

        let title =  req.body.title;
        let description = req.body.description;
        let type = req.body.type;
        let ammount = req.body.ammount;
        let userId = sessions.username;
        let latitude = req.body.latitude;
        let longtitude = req.body.longtitude;
        if (title && description && type && userId) {
            purchase.createPurchase(title, description, type, ammount, userId, latitude, longtitude, result => {
                if (result) {
                    console.log("Created purchase with id  " + result._id);
                    res.send("success");
                }
                else {
                    res.send("failure");
                }
            })
        }
        else {
            res.send("failure")
        }
    });
*/
router.route('/transactions/all/')
    .get((req,res) => {
        let userId = sessions.username;

        transaction.getUserPurchase(userId,result =>{
            if(result){
                res.send(result);
            }
            else{
                res.send("nothing found");
            }
        })
    });

router.route('/transactions/delete/')
    .post((req,res) => {
        let id = req.body.id;

        transaction.deletePurchase(id,result =>{
            if(result){
                res.send(result);
            }
            else{
                res.send("nothing found");
            }
        })
    });

router.route('/transactions/create')
    .post((req,res) => {

        let title =  req.body.title;
        let image = req.body.image;
        let cost = req.body.cost;
        let userId = sessions.username;
        let placeId = req.body.placeId;
        let quantity = req.body.quantity;
        if (title && image &&placeId && cost && userId) {
            transaction.createPurchase(title, image, cost,quantity, placeId,userId, result => {
                if (result) {
                    console.log("Created purchase with id  " + result._id);
                    res.send("success");
                }
                else {
                    res.send("failure");
                }
            })
        }
        else {
            res.send("failure")
        }
    });

router.route('/places/create')
    .post((req,res) => {
         let latitude = req.body.latitude;
         let title = req.body.title;
         let longitude = req.body.longitude;
         let userId = sessions.username;
         if(title && latitude && longitude) {
             place.createPlace(title, latitude, longitude, userId);
             res.send("Added")
         }
         else res.status(500);

    });

router.route('/places/all')
    .get((req,res) => {
        let id = sessions.username;

        place.getUserPlace(id,result=>{
            if(result){
                res.send(result);
            }
            else{
                res.status(500);
            }
        })

    });

router.route('/places/delete')
    .post((req,res) => {
        let id = req.body.id;


        place.deletePlace(id,result=>{
            if(result)  res.send("Deleted")
            else res.status(500)
        });



    });

app.post('/signin', (req, res) => {

    sessions=req.session;
    let user_name = req.body.email;
    let password = req.body.password;

    user.validateSignIn(user_name, password,  result => {
        if (result) {
            sessions.username = result;
            res.send('success');
        }
        else {
            res.send('Wrong username password');
        }
    });

});

app.post('/signup',  (req, res) => {

    let name=req.body.name;
    let email=req.body.email;
    let password=req.body.password;

    if(name && email && password){
        user.signup(name, email, password, result =>{
            if(!result){
                console.log("already exists");
            }
        });
    }
    else{
        res.send('Failure');
    }
});

app.get('/',(req,res) => {
    if(sessions && sessions.username) {
        res.sendFile(__dirname + '/resources/Home/home.html');
    }
    else{
        res.sendFile(__dirname + '/resources/Login/index.html');
    }
});

app.get('/home',(req,res) => {
    if(sessions && sessions.username) {
        res.sendFile(__dirname + '/resources/Home/home.html');

    }
    else{
        res.sendFile(__dirname + '/resources/Login/index.html');
    }
});

app.get('/signout',(req,res) => {
    sessions = null;
    res.sendFile(__dirname + '/resources/Login/index.html');
})
app.listen(7777,() => {
    console.log("Started server on", 7777);
});


app.use(express.static(path.join(__dirname,"./resources/")));


/*router.route('/addIncome/')
    .post((req,res) => {

        let title =  req.body.title;
        let description = req.body.description;
        let type = req.body.type;
        let ammount = req.body.ammount;
        let userId = sessions.username;

        if (title && description && type && userId){
            income.createIncome(title,description,type,ammount,userId, result => {
                if(result){
                    console.log("Created Income with id  " + result._id);
                    res.send("success");
                }
                else{
                    res.send("failure");
                }
            })
        }
        else {
            res.send("failure")
        }
    });
*/