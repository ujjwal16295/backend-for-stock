import { db } from "./FirebaseConfig.js";
import { collection,getDocs,getDoc, doc ,orderBy,query,addDoc, deleteDoc} from "firebase/firestore";

const ref= collection(db,"stocks")
class StockService{

    addStock=(stock,cartname)=>{
        const refForCart= collection(db,`${cartname}Cart`)

         addDoc(refForCart,stock)
    }

    getAllStock=(val,dbRef)=>{

        
        const refForcart= collection(db,dbRef)

        if(val==="index"){
            return getDocs(query(refForcart, orderBy(val)))
        }else{
            return getDocs(query(refForcart, orderBy(val,"desc")))
        }

       
    }

    getOneStock=(id)=>{
        const stockDoc=doc(db,"books",id)
        return getDoc(stockDoc)
    }

    getAllStockForCart=(val,cartname)=>{
        const refForCart= collection(db,`${cartname}Cart`)
        console.log(`${cartname}Cart`)

        if(val==="index"){
            return getDocs(query(refForCart, orderBy(val)))
        }else{
            return getDocs(query(refForCart, orderBy(val,"desc")))
        }

       
    }
    deleteStockFromCart=(id,cartname)=>{
        const stockToDelete=doc(db,`${cartname}Cart`,id)
        deleteDoc(stockToDelete)
    }




}

export default new StockService()