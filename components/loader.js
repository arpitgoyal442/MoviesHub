
import {useEffect, useRef} from "react"
import styles from "../styles/loader.module.css"
export default function loader({message,show}){

    const loaderref =useRef(null)

    useEffect(()=>{

        if(!show){

            let time= message==""?1:2000

            setTimeout(() => {

                loaderref.current.style.display="none"
                
              },time );

            
            
        }else{
            loaderref.current.style.display="block"

        }

    },[show])



    

    return (

        <div  ref={loaderref} className={styles.container}>
            <h2>{message}</h2>
        </div>
    )


}