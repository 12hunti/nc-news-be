const app = require("./app");
const { PORT = 9090 } = process.env;

app.listen(PORT, (error) => {
  if(error){
    console.log(error)
  }
  else{
    console.log(`Listening on ${PORT}...`)
  }
})
