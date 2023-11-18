//to be fixed
//change structure of json file to include activity_mc with each block of text. 

import { Box, Button, Container, FormControl, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const Act1 = () => {
  const [interviewer,setInterviewer] = useState('')
  const [interviewee,setInterviewee] = useState('')
  const [transcript,setTranscript] = useState('')
  const [interviewerError,setInterviewerError] = useState(false)
  const [intervieweeError,setIntervieweeError] = useState(false)
  const [transcriptError,setTranscriptError] = useState(false)
  const [helperText,setHelperText] = useState('')
  const [previewTranscript, setPreviewTranscript] = useState({})
  const [previewClicked,setPreviewClicked] = useState(false)
  const [transcriptTitle,setTranscriptTitle] = useState('')
  const [transcriptTitleError,setTranscriptTitleError] = useState(false)
  const [customText, setCustomText] = useState('')
  const [previewClickedError,setPreviewClickedError] = useState('');
  // const [previewInterviewerTranscript, setPreviewInterviewerTranscript] = useState([])
  // const [previewIntervieweeTranscript, setPreviewIntervieweeTranscript] = useState([])

  const get_activity_mvc = () => {
    let value = {}
    for (let i = 0; i < Object.keys(previewTranscript).length; i++) {
      for (let j = 0; j < 2; j++) {
        let dataKeyValue = i.toString() + j.toString()
        const element = document.querySelector(`[data-key="${dataKeyValue}"]`);
        if (element) {
          const htmlContent = element.outerHTML;
          const inlineStyles = element.getAttribute('style') || 'No inline styles';
          value[dataKeyValue] = {'HTML':htmlContent,'CSS':inlineStyles}

        } else {
          console.log('Element not found');
        }
      }
    //   let dataKeyValue = i.toString()
    //   const element = document.querySelector(`[data-key="${dataKeyValue}"]`);
    //   if (element) {
    //     // Extracting HTML
    //     const htmlContent = element.outerHTML;
    //     console.log('HTML Content:', htmlContent);
    
    //     // Extracting Inline CSS
    //     const inlineStyles = element.getAttribute('style') || 'No inline styles';
    //     console.log('Inline CSS:', inlineStyles);

    //     value[i] = {'HTML':htmlContent,'CSS':inlineStyles}
    // } else {
    //     console.log('Element not found');
    // }
    
  }
  console.log(value) 
    return value
  }

  const handleSubmit = (e) => {
    setInterviewerError(false)
    setIntervieweeError(false)
    setTranscriptError(false)
    setPreviewClickedError('')
    setTranscriptTitleError(false)
    e.preventDefault()
    if (previewClicked === false) {
      setPreviewClickedError('Please click on the preview button to view the transcript before submitting.')
      return;
    }
    if (interviewer === '') {
      setInterviewerError(true)
      return;
    }
    if (interviewee === '') {
      setIntervieweeError(true)
      return;
    }
    if (transcript === '') {
      setTranscriptError(true)
      return;
    }
    if (transcriptTitle === '') {
      setTranscriptTitleError(true)
      return;
    }
    //console.log(previewTranscript)
    let transcript_source_id = transcriptTitle + ' ' + Date.now()
    //console.log(transcript_source_id)
    let code = get_activity_mvc()

    let final_data = {
      custom_text : customText,
      transcript_source_id : transcript_source_id,
      content: previewTranscript,
      user_id: 'tbd',
      activity_mc: code
    }

    // console.log(final_data)
    // final_data.content = previewTranscript
    // console.log(final_data)

    // let count = 0;
    // Object.entries(previewTranscript).map(([key, value]) => {
    //   if (key % 2 === 0) {
    //     final_data.content[count] = {
    //       sentence_num: key,
    //       question_id: value.id,
    //       questioner_tag: interviewer,
    //       question_text: value.content.split(':')[1],
    //       sentence_id: -1,
    //       response_tag: interviewee,
    //       response_text: '',
    //     }
    //   } else {
    //     final_data.content[count].sentence_id = value.id
    //     final_data.content[count].response_text = value.content.split(':')[1]
    //     count++
    //   }
    //   // } else {
    //   //   final_data.content[count].sentence_id = value.id,
    //   //   final_data.content[count].response_text = value.content,
    //   // }
    // });

    localStorage.setItem("userData",JSON.stringify(final_data));
    console.log(final_data)
  }

  const handlePreview = () => {

    const cleaning = (text) => {
      //tabs are replaced by single space
      text = text.replace(/\s{4}/g,'')
      //multiple spaces are replaced by single space
      text = text.replace(/\s\s+/g,'')
      //multiple fullstops are replaced by a single fullstop
      text = text.replace(/\.+/g,'.')
      return text
    }

    setPreviewTranscript('')
    setHelperText('')
    setPreviewClickedError('')
    setInterviewerError(false)
    setIntervieweeError(false)
    setTranscriptError(false)
    if (interviewer === '') {
      setInterviewerError(true)
      return;
    }
    if (interviewee === '') {
      setIntervieweeError(true)
      return; 
    }
    if (transcript === '') {
      setTranscriptError(true)
    } else {

      let data = {};

      //console.log(transcript)
      let lines = transcript.split("\n")
      //console.log(lines)

      //checking correct interviewer and interviewee labels.
      //console.log(lines)
      // console.log(interviewer)
      // console.log(interviewee)

      const check1 = new RegExp(`${interviewer}`, 'g');
      const check2 = new RegExp(`${interviewee}`, 'g');

      function splitFirstOccurrence(str, separator) {
        const [first, ...rest] = str.split(separator);
      
        const remainder = rest.join(':');
      
        return [first.trim(), remainder.trim()];
      }

      let flag = true
      for (let i = 0; i < lines.length; i++) {
        //console.log(lines[i].match(check1))
        //console.log(lines[i])
        let str = lines[i]
        let line_splitting = splitFirstOccurrence(str,':');
        //console.log(line_splitting)
        if (lines[i] !== "" && line_splitting[1] !== '') {
          //better solution to be found 
          //console.log(lines[i].split(":"))
          //console.log(lines[i])
          flag = flag && (line_splitting[0] === interviewer || line_splitting[0] === interviewee)
          //console.log(flag)
        }
      }

      if (flag === false) {
          setHelperText("Include the correct interviewer and interviewee labels.")
          return;
      }


      // let flag = true; 
      // let count_x = 0;
      // for (let i = 0; i < lines.length; i++) {
      //   if (lines[i] !== '') {
      //     flag = flag && count_x % 2 === 0 ? lines[i].split(":")[0] === interviewer : lines[i].split(":")[0] === interviewee
      //     count_x++
      //   } else {
      //     continue
      //   }
      // }
      // if (flag === false) {
      //   setHelperText("Include the correct interviewer and interviewee labels.")
      //   return;
      // }
      
      // const check1 = /${interviewer}{1}/gi
      // const check2 = /${interviewee}{1}/gi

      //putting content into an object
      let count = 0
      let interviewCount = 0
      let intervieweeCount = 0
      let interviewFlag = false
      let intervieeeFlag = false
      let intervieeeLinesCount = 0

      //console.log(lines)
      for (let i = 0; i < lines.length; i++) {
        //console.log(lines[i].match(check1))
        lines[i] = cleaning(lines[i])
        if (lines[i].match(check1) !== null) {
          data[count] = {
            sentence_num: count, 
            question_id: interviewCount,
            questioner_tag: interviewer,
            question_text: splitFirstOccurrence(lines[i],':')[1],
            sentence_id: -1,
            response_tag: interviewee,
            response_text: {},
          }
          //console.log(data)
          //count++
          interviewFlag = true
          intervieeeFlag = false
          //data[interviewCount] = lines[i]
          interviewCount++
        } else if (lines[i].match(check2) !== null) {
          intervieeeLinesCount = 0
          data[count].sentence_id = intervieweeCount
          data[count].response_text[intervieeeLinesCount] = splitFirstOccurrence(lines[i],':')[1]
          interviewFlag = false 
          intervieeeFlag = true 
          count++
          //data[intervieweeCount] = lines[i]
          intervieweeCount++
          intervieeeLinesCount++
          //console.log(data) 
        } else if (lines[i] !== '') {
          //console.log(lines[i])
          if (interviewFlag === true) {
            data[count].question_text = cleaning(data[count-1].content + '.' + lines[i])
          } else {
            //console.log(intervieeeLinesCount)
            data[count-1].response_text[intervieeeLinesCount] = lines[i]
            intervieeeLinesCount++
          }
          //data[count-1].content = cleaning(data[count-1].content + '.' + lines[i])
        }
      }

      //console.log(data)

      /*
          sentence_num: key,
          question_id: value.id,
          questioner_tag: interviewer,
          question_text: value.content.split(':')[1],
          sentence_id: -1,
          response_tag: interviewee,
          response_text: '',

        final_data.content[count].sentence_id = value.id
        final_data.content[count].response_text = value.content.split(':')[1]
        count++
        */

      setPreviewClicked(true)
      setPreviewTranscript(data)
      //console.log(previewTranscript)

      // //split the transcript into interview and interviewee blocks by splitting 
      // let block = transcript.split("\n\n")
      
      // //check whether it has the correct interview and interviewee labels 
      // // const check1 = /Interviewer{1}/gi
      // // const check2 = /Interviewee{1}/gi
      // for (let i = 0; i < block.length; i++) {
      //   if (block[i].match(check1) !== null) {
      //     if (block[i].match(check2) !== null) {
  
      //     } else {
      //       setHelperText("Include the correct interviewee labels.")
      //     }
      //   } else {
      //     setHelperText("Include the correct interviewer labels.") 
      //   }
      // }

      // //clean the data using required checks and replacements
      // for (let i = 0; i < block.length; i++) {
      //   //tabs are replaced by single space
      //   block[i] = block[i].replace(/\s{4}/g,'')
      //   //multiple spaces are replaced by single space
      //   block[i] = block[i].replace(/\s\s+/g,'')
      //   //multiple fullstops are replaced by a single fullstop
      //   block[i] = block[i].replace(/\.+/g,'.')
      // // text = text.replace(/\s\s+/g,'')
      // // text = text.replace(/\n+/g,'.')
      // // text = text.replace(/\.+/g,'.')
      // }
      // //console.log(block)
      // setPreviewTranscript(block)

      /* 
         setPreviewTranscript(transcript)      
      
      //Splitting the transcript so that all interview and interviewee statements are compiled together.
      let section = transcript.split('\n\n')
      let interviewBlock = []
      let intervieweeBlock = []
      for (let i = 0; i < section.length; i++) {
        let sectionSplit = section[i].split('\n')
        interviewBlock.push(reveiwing(sectionSplit[0]))
        intervieweeBlock.push(reveiwing(sectionSplit[1]))
      }
      setPreviewInterviewerTranscript(interviewBlock)
      setPreviewIntervieweeTranscript(intervieweeBlock)

      let split_transcript = transcript.split('\n')
      let flag = true; 
      let count = 0;
      for (let i = 0; i < split_transcript.length; i++) {
        if (split_transcript[i] !== '') {
          flag = flag && count % 2 === 0 ? split_transcript[i].split(":")[0] === interviewer : split_transcript[i].split(":")[0] === interviewee
          count++
        } else {
          continue
        }
      }
      if (flag === false) {
        setHelperText("Include the correct interviewer and interviewee labels.")
      }
    
    
    */
   
    }
  }

  const displayTranscriptText = (value,name,key) => {
    let result = ''
    {Object.entries(value).map(([key,value])=>{
      result = result + ' ' + value
    })}
    return (
      <div>
          <Typography style={{display:'inline'}}>{name}:</Typography>
          <Typography style={{display:'inline'}} data-key={key}>{result}</Typography>
      </div>
    )
  }

  const displayTranscript = () => {
    //console.log(Object.keys(previewTranscript).length)
    //console.log(previewTranscript)
    if (Object.keys(previewTranscript).length === 0) {
      return (
        <>
          <Typography align='center'>Please press the preview button in order to preview the transcript.</Typography>
        </>
      )
    } else {
      return Object.entries(previewTranscript).map(([key, value],index) => {
        //console.log(value);
        return (
          <div key={key}>
            {/*<p>ID: {value.id}</p>*/}
            <Typography style={{display:'inline'}}>{value.questioner_tag}: </Typography>
            <Typography style={{display:'inline'}} data-key={key.toString()+0}>{value.question_text}</Typography>
            {displayTranscriptText(value.response_text,value.response_tag,key.toString()+1)}
            <br/>
            {/* <Typography>{value.content}</Typography> */}
            {/* {index % 2 !== 0 && <br />} */}
          </div>
        );
      });
    }
  }

  return (
    <Container style={{marginTop:20}}>
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
        <Typography>Enter valid interview and intervieee labels along with a transcript. You may enter custom text to provide background information regarding the transcript.</Typography>
        <TextField margin='normal' label='Custom text' fullWidth onChange={(e)=>setCustomText(e.target.value)}></TextField>
        <TextField error={transcriptTitleError} margin='normal' label='Transcript title' fullWidth onChange={(e)=>setTranscriptTitle(e.target.value)}></TextField>
        <TextField error={interviewerError} margin='normal' fullWidth variant='outlined' label="Interviewer" onChange={(e)=>setInterviewer(e.target.value)}></TextField>
        <TextField error={intervieweeError} margin='normal' fullWidth variant='outlined' label="Interviewee" onChange={(e)=>setInterviewee(e.target.value)}></TextField>
        <TextField helperText={helperText} error={transcriptError} margin='normal' rows={4} fullWidth multiline variant='outlined' label="Transcript" onChange={(e)=>setTranscript(e.target.value)}></TextField>
        <Button onClick={handlePreview} sx={{marginTop:2}} variant='outlined' fullWidth>Preview</Button>
        <Box sx={{marginTop:3,padding:2,border:`1px solid black`}}>
            {/*
            {previewInterviewerTranscript.map((item)=>{
              return (
                <>
                   <Typography sx={{whiteSpace:`pre-line`}}>{item}{"\n"}</Typography>
                </>
              )
            })}
            <Typography sx={{whiteSpace:`pre-line`}}>{"\n"}</Typography>
            {previewIntervieweeTranscript.map((item)=>{
              return (
                <>
                   <Typography sx={{whiteSpace:`pre-line`}}>{item}{"\n"}</Typography>
                </>
              )
            })}
          */}

          {displayTranscript()}
                    
        </Box>
        <Button sx={{marginTop:3,marginBottom:3}} fullWidth type="submit" variant='outlined'>Submit</Button>
        <Typography>{previewClickedError}</Typography>
      </form>
    </Container>
  );
}

export default Act1