const express = require('express');
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get("/",(req,res)=>{
    fs.readdir(`./files`, (err,files)=>{
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading notes');
        }
        res.render("index",{files:files});
    })
})

app.get("/files/:fileName",(req,res)=>{
    fs.readFile(`./files/${req.params.fileName}`,"utf-8",(err,data)=>{
        if (err) {
            console.error('Error reading file:', err);
            return res.status(404).send('Note not found');
        }
        const displayName = req.params.fileName.replace('.txt', '');
        res.render("show",{data:data,filename:displayName});
    })
})

app.get("/edit/:fileName",(req,res)=>{
    res.render("edit", {fileName: req.params.fileName});
})

app.post("/edit",(req,res)=>{
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new.split(" ").join("")}.txt`, (err)=>{
        res.redirect("/");
    })
})

app.post("/create",(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, req.body.details, (err)=>{
        res.redirect("/");
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})