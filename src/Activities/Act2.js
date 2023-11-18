import { Container, TextField, Typography, Box, Button } from "@mui/material"
import { yellow } from "@mui/material/colors";
import { useEffect, useState } from "react"

const Act2 = () => {
    const [htmlContent, setHtmlContent] = useState([]);
    const [interviewer,setInterviewer] = useState('')
    const [interviewee,setInterviewee] = useState('')
    
    useEffect(()=>{

        let data = JSON.parse(localStorage.getItem("userData"));
        console.log(data)
        let htmlContent = []
        for (let i = 0; i < Object.keys(data.activity_mc).length/2; i++){
            for (let j = 0; j < 2; j++) {
                let index = i.toString()+j.toString()
                //console.log(index)
                htmlContent.push(data.activity_mc[index].HTML)
            }
        }
        //console.log(htmlContent)
        setHtmlContent(htmlContent)
        setInterviewer(data.content[0].questioner_tag)
        setInterviewee(data.content[0].response_tag)
    },[])

    // const displayTranscript = () => {
        
    //     //const container = document.getElementById('content-container');
    
    //     if (container) {
    //         container.innerHTML = htmlContent; 
    //     }   
    // }

    const handleClick = (event,index) => {
        // event.target will be the clicked span element
        //console.log("Clicked on span with content:", event.target.innerHTML);
        if (index % 2 !== 0) {
            if (event.target.style.backgroundColor === '') {
                event.target.style.backgroundColor = 'yellow'
                event.target.style.color = 'black'
            } else {
                event.target.style.backgroundColor = ''
                event.target.style.color = 'black'
            }
        }
    };

    const getName = (index) => {
        if (index % 2 === 0) {
            return interviewer
        } else {
            return interviewee
        }
    }



    return (
        <Container style={{marginTop:20}}>
            <form>
                <Typography>Click on interviewee sentences to toggle highlighting.</Typography>
                <Box sx={{marginTop:3,padding:2,border:`1px solid black`}} id="content-container">
                {/* <div style={{whiteSpace:`pre-line`}} dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
                {htmlContent.map((line, index) => (
                    <Typography style={{whiteSpace:`pre-line`}}>
                        {getName(index)}
                        <Typography style={{display:'inline'}}>: </Typography>   
                        <span onClick={(e)=>{handleClick(e,index)}} key-id={index} dangerouslySetInnerHTML={{ __html: line }}></span>
                        {'\n\n'}
                    </Typography>
                       ))}
                </Box>
                <Button sx={{marginTop:3,marginBottom:3}} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>

            
        </Container>
    )
}

export default Act2