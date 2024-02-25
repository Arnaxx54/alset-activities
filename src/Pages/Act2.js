import { Container, TextField, Typography, Box, Button, FormControlLabel, Switch, Divider } from "@mui/material"
import { yellow } from "@mui/material/colors";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'

const Act2 = () => {
    const [activityMVCContent, setActivityMVCContent] = useState({});
    const [userData, setUserData] = useState({})
    const [transcriptHighlighting, setTranscriptHighlighting] = useState(false)
    const [label, setLabel] = useState('Custom Text')
    const [instruction, setInstruction] = useState(`Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.`)
    const [newChain, setNewChain] = useState(false)
    const [instructor, setInstructor] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()
    const [logs, setLogs] = useState({})

    // gets activity mvc for each interviewee sentence
    const getActivityMVCInterviewee = (data) => {
        let content = {}
        Object.entries(data).map(([key, value]) => {
            content[key] = value.activity_mvc
        })
        return content
    }

    useEffect(() => {

        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        } else {
            let ActivitiesId = sessionStorage.getItem("ActivitiesId")
            if (sessionStorage.getItem("Occupation") == "Student") {
                axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/get/byId/${ActivitiesId}`).then((response) => {
                    setLogs(response.data[0].StudentEvent)
                })
            } else {
                axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/byId/${ActivitiesId}`).then((response) => {
                    setLogs(response.data[0].InstructorEvent)
                })
            }
        }

        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true)
        }

        if (id) {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`).then((response) => {
                if (response.data !== null) {
                    if (response.data.predefinedHighlighting !== null) {
                        setTranscriptHighlighting(response.data.predefinedHighlighting)
                    }
                    setLabel(response.data.label)
                    setInstruction(response.data.instruction)
                    setUserData(response.data)
                    if (response.data.content !== null && response.data.content !== "" && Object.entries(response.data.content).length !== 0) {
                        let activity_mvc_data = {}
                        for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                            if (response.data.content[i].questioner_tag !== undefined) {
                                activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                            } else {
                                activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                            }
                        }
                        setActivityMVCContent(activity_mvc_data)
                    } else if (sessionStorage.getItem("ActivityOneId")) {
                        axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`).then((response) => {
                            if (response.data !== null) {
                                setUserData(response.data)
                                let activity_mvc_data = {}
                                for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                                    if (response.data.content[i].questioner_tag !== undefined) {
                                        activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                                    } else {
                                        activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                                    }
                                }
                                setActivityMVCContent(activity_mvc_data)
                            } else {
                                alert("Before progressing to Activity 2, please complete Activity 1.")
                            }
                        })
                    }
                }
            })
        } else if (id !== "null") {
            axios.get(`https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`).then((response) => {
                if (response.data !== null) {
                    setUserData(response.data)
                    let activity_mvc_data = {}
                    for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
                        if (response.data.content[i].questioner_tag !== undefined) {
                            activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
                        } else {
                            activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
                        }
                    }
                    setActivityMVCContent(activity_mvc_data)
                } else {
                    alert("Before progressing to Activity 2, please complete Activity 1.")
                }
            })
        } else if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.")
        }
    }, [])

    const highlightedStyle = {
        backgroundColor: 'yellow',
    };

    // handles highlighting of interviewee text
    const handleClick = (event) => {
        if (!transcriptHighlighting || sessionStorage.getItem("Occupation") === "Instructor") {
            const currentStyle = event.target.style;
            if (currentStyle.backgroundColor === 'yellow') {
                currentStyle.backgroundColor = '';
            } else {
                currentStyle.backgroundColor = highlightedStyle.backgroundColor;
            }
        }
    };

    // displays interviewee text
    const displayInterviewee = (data, key) => {
        return Object.entries(data).map(([key2, value]) => (
            <Typography display="inline" onClick={handleClick} dangerouslySetInnerHTML={{ __html: value.html }}></Typography>
        ));
    };

    // gets activity mvc 
    const getActivityMVC = (value) => {
        const element = document.querySelector(`[id="${value}"]`);
        if (element) {
            const htmlContent = element.outerHTML;
            const backgroundColor = element.style.backgroundColor;
            const inlineStyles = element.getAttribute('style') ? element.getAttribute('style') : 'No inline styles';
            return { html: htmlContent, css: inlineStyles }
        } else {
            alert('Element not found');
            return undefined
        }
    }

    // handles user reset
    const onReset = () => {
        window.location.reload()
    }

    // handles user submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        let userContent = userData
        Object.entries(userContent.content).map(([key, value]) => {
            if (value.questioner_tag !== undefined) {
                value.activity_mvc = getActivityMVC(key)
            } else {
                Object.entries(value.response_text).map(([key2, value2]) => {
                    value2.activity_mvc = getActivityMVC(key.toString() + key2.toString())
                })
            }

        })

        if (!id) {
            delete userContent['transcriptEditable']
        }
        delete userContent['id']
        userContent.predefinedHighlighting = transcriptHighlighting
        userContent.UserId = sessionStorage.getItem("UserId")
        userContent.label = document.getElementById("activity-two-label").innerHTML
        userContent.instruction = document.getElementById("activity-two-instruction").innerHTML
        let data = { id: sessionStorage.getItem("ActivitiesId"), content: userContent }


        console.log('final data')
        console.log(data)

        // if (newChain) {
        //     await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/new-chain", data).then((response) => {
        //         const ActivitiesID = response.data.ActivitiesId.id
        //         const ActivityTwoId = response.data.ActivityTwoId
        //         sessionStorage.setItem("ActivitiesId", ActivitiesID)
        //         sessionStorage.setItem("ActivityTwoId", ActivityTwoId)
        //         sessionStorage.removeItem("ActivityThreeId")
        //         sessionStorage.removeItem("ActivityFourId")
        //         sessionStorage.removeItem("ActivityFiveId")
        //         sessionStorage.removeItem("ActivitySixId")
        //     })
        // } else

        if (id) {
            await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`, data)
            if (newChain) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
                sessionStorage.removeItem("ActivityThreeId")
                sessionStorage.removeItem("ActivityFourId")
                sessionStorage.removeItem("ActivityFiveId")
                sessionStorage.removeItem("ActivitySixId")

                let logsData = logs
                logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 2 has been reinitialized." }
                if (!instructor) {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                } else {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                }
            } else {
                let logsData = logs
                logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 2 has been updated." }
                if (!instructor) {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                } else {
                    await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
                }
            }
        } else {
            await axios.post("https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo", data).then((response) => {
                const ActivityTwoId = response.data.id;
                sessionStorage.setItem("ActivityTwoId", ActivityTwoId)
            })

            let logsData = logs
            logsData[Object.keys(logs).length] = { DateTime: Date.now(), EventType: "Activity 2 has been created." }
            if (!instructor) {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            } else {
                await axios.post(`https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/update/byId/${sessionStorage.getItem("ActivitiesId")}`, logsData)
            }

        }

        sessionStorage.setItem("predefinedHighlighting", transcriptHighlighting)
        if (sessionStorage.getItem("Occupation") === "Instructor") {
            navigate('/')
        } else if (sessionStorage.getItem("ActivityThreeId") !== "null" && sessionStorage.getItem("ActivityThreeId") !== null) {
            navigate(`/activitythree/${sessionStorage.getItem("ActivityThreeId")}`)
        } else {
            navigate('/activitythree')
        }
    }

    return (
        <Container style={{ marginTop: 20 }}>
            <div style={{ display: "flex", direction: "row" }}>
                <h2>Activity 2:</h2>&nbsp;&nbsp;
                <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }} id="activity-two-label"></h2>
            </div>
            <form onSubmit={handleSubmit}>
                <Typography>Instructions (Editable by Instructors): </Typography>
                <Typography id="activity-two-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} style={{ minHeight: 1, borderRight: "solid rgba(0,0,0,0) 1px", outline: "none" }}></Typography>
                {instructor && <Divider style={{ marginTop: 10 }} />}
                {instructor && <Typography style={{ marginTop: 10 }}>Upon submission of this activity, you will be redirected to the home page. You can go back to the home page and choose the configurations for the remaining activities.</Typography>}
                {instructor && <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={transcriptHighlighting} onChange={() => setTranscriptHighlighting((prev) => !prev)} />} label="Predefined Interview Highlighting" />}
                {!instructor && transcriptHighlighting && <Typography style={{ marginTop: 10 }}>You are not allowed to edit the highlighting of the transcript in this template.</Typography>}
                <Button onClick={() => { onReset() }} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Reset</Button>
                <FormControlLabel style={{ marginTop: 10 }} control={<Switch checked={newChain} onChange={() => { alert("Warning: All data in next four activities corresponding to this chain will be erased."); setNewChain((prev) => !prev) }} />} label="Create a new chain of activities" />
                <Box sx={{ marginTop: 3, padding: 2, border: '1px solid black' }} id="content-container">
                    {Object.entries(activityMVCContent).map(([key, value]) => {
                        if (key % 2 !== 0) {
                            return (
                                <>
                                    <div>
                                        <Typography display="inline">{value.tag}: </Typography>
                                        <Typography display="inline" dangerouslySetInnerHTML={{ __html: value.activity_mvc.html }}></Typography>
                                    </div>
                                    <div>
                                        <br />
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <div>
                                        <Typography display="inline"><strong>{value.tag}</strong>: </Typography>
                                        {displayInterviewee(value.activity_mvc, key)}
                                    </div>
                                    <div>
                                        <br />
                                    </div>
                                </>
                            )
                        }
                    })}
                </Box>
                <Button sx={{ marginTop: 3, marginBottom: 3 }} fullWidth type="submit" variant='outlined'>Submit</Button>
            </form>
        </Container>
    )
}

export default Act2