import express from "express"
import cors from "cors"
import StockService from "./StockService.js"
import client from "./client.js"
import { auth } from "./FirebaseConfig.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"


const app=express()
app.use(cors())
app.use(express.json())


app.post("/",async(req,res)=>{
const val = req.body.val
const dbRef= req.body.dbRef

const cachedData = await client.get(`${dbRef}${val}`)

if(cachedData){
    res.json(JSON.parse(cachedData))

}else{
    const data = await StockService.getAllStock(val,dbRef)
    const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))
    await client.set(`${dbRef}${val}`,JSON.stringify(result))
    await client.expire(`${dbRef}${val}`,30)
    
    res.json(result)
}


})
app.post("/cart",async(req,res)=>{
    const val = req.body.val
    const cartname= req.body.cartname

    const cachedData = await client.get(`stocks${cartname}:${val}`)
    if(cachedData){
        res.json(JSON.parse(cachedData))
    }else{
        const data = await StockService.getAllStockForCart(val,cartname)
        const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))

        await client.set(`stocks${cartname}:${val}`,JSON.stringify(result))
        await client.expire(`stocks${cartname}:${val}`,30)
        res.json(result)
    }

    })

    app.delete("/cart",async(req,res)=>{
        const id = req.body.id
        const cartname= req.body.cartname
        
        const allkeys=  await client.keys(`stocks${cartname}:*`)
        await client.del(...allkeys)
        const data = await StockService.deleteStockFromCart(id,cartname)

                // const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))
        
        })    

        
        app.put("/cart",async(req,res)=>{
            const stock = req.body.stock
            const cartname= req.body.cartname
            const allkeys=  await client.keys(`stocks${cartname}:*`)
            await client.del(...allkeys)
            
            const data = await StockService.addStock(stock,cartname)
          
            // const result= data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            
            })         


 
    
    app.post("/auth",async(req,res)=>{
        console.log("login called")
        const authType = req.body.authType
        const email= req.body.email
        const password = req.body.password
        if(authType==="login"){
            signInWithEmailAndPassword(auth,email,password)
            .then((usercredential)=>{
               const useEmail= usercredential.user.email
              res.json({email:usercredential.user.email})
             
     
            })
            .catch((error)=>{
             res.json({email:"error",type:error})
            })
        }else if(authType==="signin"){

            createUserWithEmailAndPassword(auth,email,password)
            .then((usercredential)=>{
    
              res.json({email:usercredential.user.email})
             
     
            })
            .catch((error)=>{
             res.json({email:"error",type:error})
            })
        }
        
    })   

app.listen(4000,()=>{
    console.log("server has started")
})