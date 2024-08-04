import { createContext, useState } from "react"
import * as ReactDOM from 'react-dom/client';
import run from "../config/gemini";
export const Context=createContext();
const ContextProvider=(props) =>{
const [input,setInput]=useState("");
const[recentPrompt,setRecentPrompt]=useState("");
const[prevprompt,setPrevPrompt]=useState([]);
const[showresult,setShowResult]=useState(false);
const[loading,setLoading]=useState(false);
const[resultdata,setResultdata]=useState("");

/*const delayPara=(index,nextWord)=>
    {
       setTimeout( function(){
        setResultdata(
            prev=>prev+nextWord
        ),75*index
       }

       )
    }*/
   const newChat=()=>
    {
        setLoading(false);
        setShowResult(false);
    }
  const onSent= async(prompt) =>
    {
        setResultdata("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt!==undefined)
            {
                response=await run(prompt);
                setRecentPrompt(prompt);
            }
            else{
                setPrevPrompt(prev=>[...prev,input])
                setRecentPrompt(input);
                response=await run(input);
            }
       /*[...prev, input] creates a new array with:
        All elements of the current prevprompt array (...prev).
        Followed by input, which is the new value to be added to the end of the array.
*/        
        let responseArray= response.split("**");
        /*let newResponse="";
        for(let i=0;i<responseArray.length;i++)
            {
                if(i===0||i%2!==1){
                    newResponse+=responseArray[i];
                }
                else
                {
                    const myElement = <b>{responseArray[i]}</b>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(myElement);
                    
                    newResponse += myElement;
                   
                }
            }
            /*
       */
        const newResponse = responseArray.map((item, index) => {
            if (index === 0 || index % 2 === 0) {
              return item;
            } else {
              return <b key={index}>{item}</b>;
            }
          });
          /*let newResponse2=newResponse.split("*").join("</br>");*/
          const newResponseWithBr = newResponse.flatMap((item, index) => {
            // Split the item by "*" and insert <br /> in between
            if (typeof item === 'string') {
              const parts = item.split('*');
              return parts.flatMap((part, idx) => 
                idx < parts.length - 1 
                  ?part
                  :  [part, <br key={`br-${index}-${idx}`} />] 
              );
            }
            return item;
          });
          /*let newResponseString = newResponseWithBr.join(" ");
          let newResponseArray=newResponseString.split(" ");
          for(let i=0;i<newResponseArray.length;i++)
            {
                const nextWord=newResponseArray[i];
                delayPara(i,nextWord+" ");
            }*/
                /*newResponseWithBr
                .join(" ")
                .split(" ")
                .map((nextWord, index) => delayPara(index, nextWord + " "));*/
          setResultdata(newResponseWithBr)
          /*const addElementsWithDelay = (elements, index = 0) => {
            if (index < elements.length) {
              const nextElement = elements[index];
              delayPara(index, nextElement);
              addElementsWithDelay(elements, index + 1);
            }
          };
      
          addElementsWithDelay(newResponseWithBr);*/
        setLoading(false);
        setInput("")
    }
  
    const contextValue = {
    prevprompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showresult,
    loading,
    resultdata,
    input,
    setInput,newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {
                props.children
            }
        </Context.Provider>
    )
}
export default ContextProvider