const redis = require("redis")
const client = redis.createClient()

// String
// client.set("name","bahaa")
// client.setex("data",10,"value two")
// client.get("name",(err,val)=>console.log(val))
// client.get("name",console.log)
// client.get("data",(err,val)=>console.log(val))

// Hash
client.hset("german","book","bauch")
client.hget("german","book",(err,val)=>console.log(val));
client.hget("german",console.log)