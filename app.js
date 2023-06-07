const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");


const app = express();

// Body Parser Midlleware
app.use(bodyParser.urlencoded({extended: true}));

// Static Folder
app.use(express.static(path.join(__dirname,"public")));

// Signup Route
app.post("/signup", (req,res)=>{
    const { firstName, lastName, email }  = req.body;
    // console.log(firstName);
    // Make sure fields are filled
    if(!firstName || !lastName || !email){
        res.redirect("/failure.html");
        return;
    }
    // Construct req Data
    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields:{
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    const options = {
        url: "https://us21.api.mailchimp.com/3.0/lists/4bdba32ebc",
        method : "POST",
        headers: {
            Authorization : "auth 4f198b3fcd94a209279b55e920da5a66-us21"
        },
        body: postData
    }
    request(options, (err,response, body) => {
        if(err) {
            res.redirect("/failure.html");
        }
        else {
            if(response.statusCode === 200){
                res.redirect("/success.html");
            } else {
                res.redirect("/failure.html");
            }
        } 
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));