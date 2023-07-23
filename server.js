const express = require("express")
const cors = require("cors")

const app = express()

var corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const db = require("./app/models")
const Role = db.role
const dbConfig = require("./app/config/db.config")

db.mongoose.connect(`mongodb+srv://${dbConfig.HOST}:${dbConfig.PASSWORD}@${dbConfig.DB}.j7xwaze.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB.")
    initial();
}).catch((error) => {
    console.error("Connection error", error)
    process.exit()
})

const initial = () => {
    Role.estimatedDocumentCount().then(async (count) => {
        if(count === 0){
            try{
                const addUserRole = await new Role({name: "user"}).save()
                if (addUserRole){
                    console.log("added 'user' to roles collection")
                }

                const addModeratorRole = await new Role({name: "moderator"}).save()
                if (addModeratorRole){
                    console.log("added 'moderator' to roles collection")
                }

                const addAdminRole = await new Role({name: "admin"}).save()
                if (addAdminRole){
                    console.log("added 'admin' to rolse collection")
                }
            } catch (err) {
                console.log("error", err)
            }

        }
    }).catch((err) => {
        console.log("Error!" , err)
    })

}

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.get("/", (req, res) => {
    res.json({message: "Server is running..."})
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})