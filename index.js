import express from "express"
import cors from "cors"
import StockService from "./StockService.js"
import client from "./client.js"


const app=express()
app.use(cors())
app.use(express.json())


app.post("/",async(req,res)=>{
const val = req.body.val
const dbRef= req.body.dbRef
console.log("called")
console.log(val)
console.log(dbRef)
const cachedData = await client.get(`stocks${val}`)

if(cachedData){
    res.json(JSON.parse(cachedData))

}else{
    const data = await StockService.getAllStock(val,dbRef)
    const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))
    await client.set(`stocks${val}`,JSON.stringify(result))
    await client.expire(`stocks${val}`,10)
    
    res.json(result)
}


})
app.post("/cart",async(req,res)=>{
    const val = req.body.val
    const cartname= req.body.cartname
    console.log("cart called please work dude")
    console.log(val)
    console.log(cartname)
    const cachedData = await client.get(`stocks${cartname}:${val}`)
    if(cachedData){
        res.json(JSON.parse(cachedData))
    }else{
        const data = await StockService.getAllStockForCart(val,cartname)
        const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))

        await client.set(`stocks${cartname}:${val}`,JSON.stringify(result))
        await client.expire(`stocks${cartname}:${val}`,10)
        res.json(result)
    }

    })

    app.delete("/cart",async(req,res)=>{
        const id = req.body.id
        const cartname= req.body.cartname
        
        
        const data = await StockService.deleteStockFromCart(id,cartname)
        const allkeys=  await client.keys(`stocks${cartname}:*`)
        await client.del(...allkeys)
                // const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))
        
        })    

        
        app.put("/cart",async(req,res)=>{
            const stock = req.body.stock
            const cartname= req.body.cartname
            
            
            const data = await StockService.addStock(stock,cartname)
            const allkeys=  await client.keys(`stocks${cartname}:*`)
            await client.del(...allkeys)
            // const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            
            })         

app.listen(4000,()=>{
    console.log("server has started")
})