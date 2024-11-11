const mongoose = require('mongoose');
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");  // Added method-override import
const app = express();

// Middleware Setup
app.use(methodOverride('_method'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/MongoTest');
    console.log("Connection successful!");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}

main();

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model("User", userSchema);
;

// Start the Express server


// app.delete("/delete/:id",(req,res)=>{
//     let UserId=req.params.id;
//     User.findByIdAndDelete(UserId)
//     .then(()=>res.redirect("/getdata"))
//     .catch(error => res.status(500).send("Error in deletiion"));
// })


app.delete("/delete/:id", (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
        .then(() => res.redirect("/getdata"))
        .catch(error => res.status(500).send("Error in deletion"));
});

app.patch("/edit/:id", (req, res) => {
    const userId = req.params.id;  // Corrected: get the ID directly
    const newEmail = req.body.editemail;

    User.findByIdAndUpdate(userId, { email: newEmail })
        .then(() => res.redirect("/getdata"))
        .catch(error => res.status(500).send("Error updating email"));
});

app.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const person = await User.findById(id);
    res.render("edit.ejs", { person });
});




app.post("/new/id",async(req,res)=>{
   let  {newname,newemail,newage}=req.body;
    let user1=new User({
        name:newname,
        email:newemail,
        age:newage
    });
    user1.save()
    .then((res)=>{
        console.log("new Member Registered");
    })
    .catch((err)=>{
        console.log(err);
    })
    res.redirect("/getdata");
})

app.get("/new",(req,res)=>{
    res.render("new.ejs");
})

app.get("/getdata", async (req, res) => {
    try {
        let data = await User.find({});

        res.render("home.ejs", { data });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});



app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

