import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Act2 = () => {
  const [activityMVCContent, setActivityMVCContent] = useState({});
  const [userData, setUserData] = useState({});
  const [transcriptHighlighting, setTranscriptHighlighting] = useState(false);
  const [label, setLabel] = useState("Activity 2 Label");
  const [instruction, setInstruction] = useState(
    `Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.`
  );
  const [newChain, setNewChain] = useState(false);
  const [instructor, setInstructor] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // gets activity mvc for each interviewee sentence - to be phased out.
  // const getActivityMVCInterviewee = (data) => {
  //     let content = {}
  //     Object.entries(data).map(([key, value]) => {
  //         content[key] = value.activity_mvc
  //     })
  //     return content
  // }

  useEffect(() => {
    if (id === "null") {
      alert(
        "Please go back to the previous activity and submit it to continue."
      );
    }

    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    if (id) {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`
        )
        .then((response) => {
          if (response.data !== null) {
            if (response.data.predefinedHighlighting !== null) {
              setTranscriptHighlighting(response.data.predefinedHighlighting);
            }
            setLabel(response.data.label);
            setInstruction(response.data.instruction);
            setUserData(response.data);
            if (
              response.data.content !== null &&
              response.data.content !== "" &&
              Object.entries(response.data.content).length !== 0
            ) {
              let interviewer = response.data.content[1].questioner_tag;
              let interviewee = response.data.content[2].response_tag;

              let activity_mvc_data = {};

              for (
                let i = 1;
                i < Object.keys(response.data.activity_mvc).length + 1;
                i++
              ) {
                if (i % 2 !== 0) {
                  activity_mvc_data[i] = {
                    tag: interviewer,
                    activity_mvc: response.data.activity_mvc[i],
                  };
                } else {
                  activity_mvc_data[i] = {
                    tag: interviewee,
                    activity_mvc: response.data.activity_mvc[i],
                  };
                }
              }
              setActivityMVCContent(activity_mvc_data);
            } else if (sessionStorage.getItem("ActivityOneId")) {
              axios
                .get(
                  `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem(
                    "ActivityOneId"
                  )}`
                )
                .then((response) => {
                  if (response.data !== null) {
                    setUserData(response.data);
                    if (response.data.content != null) {
                      let interviewer = response.data.content[1].questioner_tag;
                      let interviewee = response.data.content[2].response_tag;

                      let activity_mvc_data = {};

                      for (
                        let i = 1;
                        i < Object.keys(response.data.activity_mvc).length + 1;
                        i++
                      ) {
                        if (i % 2 !== 0) {
                          activity_mvc_data[i] = {
                            tag: interviewer,
                            activity_mvc: response.data.activity_mvc[i],
                          };
                        } else {
                          activity_mvc_data[i] = {
                            tag: interviewee,
                            activity_mvc: response.data.activity_mvc[i],
                          };
                        }
                      }
                      setActivityMVCContent(activity_mvc_data);
                    }
                  } else {
                    alert(
                      "Before progressing to Activity 2, please complete Activity 1."
                    );
                  }
                });
            }
          }
        });
    } else if (id !== "null") {
      axios
        .get(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activityone/byId/${sessionStorage.getItem(
            "ActivityOneId"
          )}`
        )
        .then((response) => {
          if (response.data !== null) {
            setUserData(response.data);
            if (response.data.content != null) {
              let interviewer = response.data.content[1].questioner_tag;
              let interviewee = response.data.content[2].response_tag;

              let activity_mvc_data = {};

              for (
                let i = 1;
                i < Object.keys(response.data.activity_mvc).length + 1;
                i++
              ) {
                if (i % 2 !== 0) {
                  activity_mvc_data[i] = {
                    tag: interviewer,
                    activity_mvc: response.data.activity_mvc[i],
                  };
                } else {
                  activity_mvc_data[i] = {
                    tag: interviewee,
                    activity_mvc: response.data.activity_mvc[i],
                  };
                }
              }
              setActivityMVCContent(activity_mvc_data);
            }

            // let activity_mvc_data = {}
            // for (let i = 1; i < Object.keys(response.data.content).length + 1; i++) {
            //     if (response.data.content[i].questioner_tag !== undefined) {
            //         activity_mvc_data[i] = { tag: response.data.content[i].questioner_tag, activity_mvc: response.data.content[i].activity_mvc }
            //     } else {
            //         activity_mvc_data[i] = { tag: response.data.content[i].response_tag, activity_mvc: getActivityMVCInterviewee(response.data.content[i].response_text) }
            //     }
            // }
          } else {
            alert(
              "Before progressing to Activity 2, please complete Activity 1."
            );
          }
        });
    } else if (id === "null") {
      alert(
        "Please go back to the previous activity and submit it to continue."
      );
    }
  }, []);

  const highlightedStyle = {
    backgroundColor: "yellow",
  };

  // handles highlighting of interviewee text
  const handleClick = (event) => {
    if (
      !transcriptHighlighting ||
      sessionStorage.getItem("Occupation") === "Instructor"
    ) {
      const currentStyle = event.target.style;
      if (currentStyle.backgroundColor === "yellow") {
        currentStyle.backgroundColor = "";
      } else {
        currentStyle.backgroundColor = highlightedStyle.backgroundColor;
      }
    }
  };

  // displays interviewee text
  const displayInterviewee = (data, key) => {
    return Object.entries(data).map(([key2, value]) => (
      <Typography
        display="inline"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: value.html }}
      ></Typography>
    ));
  };

  // gets activity mvc
  const getActivityMVC = (value) => {
    const element = document.querySelector(`[id="${value}"]`);
    if (element) {
      const htmlContent = element.outerHTML;
      const backgroundColor = element.style.backgroundColor;
      const inlineStyles = element.getAttribute("style")
        ? element.getAttribute("style")
        : "No inline styles";
      return { html: htmlContent, css: inlineStyles };
    } else {
      alert("Element not found");
      return undefined;
    }
  };

  // handles user reset
  const onReset = () => {
    window.location.reload();
  };

  // handles user submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let userContent = userData;
    const check = new RegExp("background-color: yellow", "g");

    for (let i = 1; i < Object.keys(userContent.activity_mvc).length + 1; i++) {
      if (i % 2 != 0) {
        let activity_mvc_value = getActivityMVC(i.toString());
        userContent.activity_mvc[i] = activity_mvc_value;
        userContent.content[i].sentenceUserHighlightA2 = false;
      } else {
        for (
          let j = 1;
          j < Object.keys(userContent.activity_mvc[i]).length + 1;
          j++
        ) {
          let activity_mvc_value = getActivityMVC(i.toString() + j.toString());
          userContent.activity_mvc[i][j] = activity_mvc_value;
          if (activity_mvc_value.css.match(check)) {
            userContent.content[i].response_text[
              j
            ].sentenceUserHighlightA2 = true;
          } else {
            userContent.content[i].response_text[
              j
            ].sentenceUserHighlightA2 = false;
          }
        }
      }
    }

    // Object.entries(userContent.content).map(([key, value]) => {
    //     if (value.questioner_tag !== undefined) {
    //         value.activity_mvc = getActivityMVC(key)
    //     } else {
    //         Object.entries(value.response_text).map(([key2, value2]) => {
    //             value2.activity_mvc = getActivityMVC(key.toString() + key2.toString())
    //         })
    //     }

    // })

    if (!id) {
      delete userContent["transcriptEditable"];
    }
    delete userContent["id"];
    userContent.predefinedHighlighting = transcriptHighlighting;
    userContent.UserId = sessionStorage.getItem("UserId");
    userContent.label = document.getElementById("activity-two-label").innerHTML;
    userContent.instruction = document.getElementById(
      "activity-two-instruction"
    ).innerHTML;
    let data = {
      id: sessionStorage.getItem("ActivitiesId"),
      content: userContent,
    };

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
      await axios.post(
        `https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${id}`,
        data
      );
      if (newChain) {
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo/byId/${sessionStorage.getItem(
            "ActivitiesId"
          )}/new-chain`
        );
        sessionStorage.removeItem("ActivityThreeId");
        sessionStorage.removeItem("ActivityFourId");
        sessionStorage.removeItem("ActivityFiveId");
        sessionStorage.removeItem("ActivitySixId");

        if (!instructor) {
          let data = {
            DateTime: Date.now(),
            StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
            StudentId: sessionStorage.getItem("UserId"),
            Event: "Reinitialise",
            ActivityId: sessionStorage.getItem("ActivityTwoId"),
            ActivityType: "Activity 2",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,
            data
          );
        } else {
          let data = {
            DateTime: Date.now(),
            ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
            InstructorId: sessionStorage.getItem("UserId"),
            Event: "Reinitialise",
            ActivityId: sessionStorage.getItem("ActivityTwoId"),
            ActivityType: "Activity 2",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
            data
          );
        }
      } else {
        if (!instructor) {
          let data = {
            DateTime: Date.now(),
            StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
            StudentId: sessionStorage.getItem("UserId"),
            Event: "Update",
            ActivityId: sessionStorage.getItem("ActivityTwoId"),
            ActivityType: "Activity 2",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,
            data
          );
        } else {
          let data = {
            DateTime: Date.now(),
            ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
            InstructorId: sessionStorage.getItem("UserId"),
            Event: "Update",
            ActivityId: sessionStorage.getItem("ActivityTwiId"),
            ActivityType: "Activity 2",
          };
          await axios.post(
            `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
            data
          );
        }
      }
    } else {
      await axios
        .post(
          "https://activities-alset-aef528d2fd94.herokuapp.com/activitytwo",
          data
        )
        .then((response) => {
          const ActivityTwoId = response.data.id;
          sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
        });

      if (!instructor) {
        let data = {
          DateTime: Date.now(),
          StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
          StudentId: sessionStorage.getItem("UserId"),
          Event: "Create",
          ActivityId: sessionStorage.getItem("ActivityTwoId"),
          ActivityType: "Activity 2",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/studentlog/create`,
          data
        );
      } else {
        let data = {
          DateTime: Date.now(),
          ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
          InstructorId: sessionStorage.getItem("UserId"),
          Event: "Create",
          ActivityId: sessionStorage.getItem("ActivityTwoId"),
          ActivityType: "Activity 2",
        };
        await axios.post(
          `https://activities-alset-aef528d2fd94.herokuapp.com/instructorlog/create`,
          data
        );
      }
    }

    sessionStorage.setItem("predefinedHighlighting", transcriptHighlighting);
    if (sessionStorage.getItem("Occupation") === "Instructor") {
      navigate("/");
    } else if (
      sessionStorage.getItem("ActivityThreeId") !== "null" &&
      sessionStorage.getItem("ActivityThreeId") !== null
    ) {
      navigate(`/activitythree/${sessionStorage.getItem("ActivityThreeId")}`);
    } else {
      navigate("/activitythree");
    }
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          direction: "row",
          fontFamily: `"Lato", sans-serif`,
        }}
      >
        {/* <h2>Activity 2:</h2>&nbsp;&nbsp; */}
        <h2
          dangerouslySetInnerHTML={{ __html: ` ${label}` }}
          contentEditable="true"
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
          }}
          id="activity-two-label"
        ></h2>
        <Button
          onClick={() => {
            onReset();
          }}
          sx={{
            marginLeft: "auto",
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          Reset
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* <Typography>Instructions (Editable by Instructors): </Typography> */}
        <Typography
          id="activity-two-instruction"
          dangerouslySetInnerHTML={{ __html: ` ${instruction}` }}
          contentEditable={instructor && true}
          style={{
            minHeight: 1,
            borderRight: "solid rgba(0,0,0,0) 1px",
            outline: "none",
            fontFamily: `"Lato", sans-serif`,
            fontSize: 17,
          }}
        ></Typography>
        {instructor && <Divider style={{ marginTop: 10 }} />}
        {instructor && (
          <Typography
            style={{
              marginTop: 10,
              fontFamily: `"Lato", sans-serif`,
              fontSize: 17,
            }}
          >
            After submitting this activity, you will be automatically redirected
            to the home page. From there, you can return to select
            configurations for the remaining activities.
          </Typography>
        )}
        {instructor && (
          <FormControlLabel
            style={{ marginTop: 10 }}
            control={
              <Switch
                checked={transcriptHighlighting}
                onChange={() => setTranscriptHighlighting((prev) => !prev)}
              />
            }
            label="Standardised Script Highlighting"
          />
        )}
        {!instructor && transcriptHighlighting && (
          <Typography style={{ marginTop: 10 }}>
            You are not allowed to edit the highlighting of the transcript in
            this template.
          </Typography>
        )}
        {/* <Button onClick={() => { onReset() }} sx={{ marginTop: 2 }} variant='outlined' fullWidth>Reset</Button> */}
        <FormControlLabel
          style={{ marginTop: 10 }}
          control={
            <Switch
              checked={newChain}
              onChange={() => {
                if (!newChain) {
                  alert(
                    "Caution: Data associated with the next four activities in this sequence will be permanently deleted"
                  );
                }
                setNewChain((prev) => !prev);
              }}
            />
          }
          label="Re-initialise Activity 2 and subsequent activites"
        />
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            border: "1px solid black",
            borderRadius: 2,
          }}
          id="content-container"
        >
          {Object.entries(activityMVCContent).map(([key, value]) => {
            if (key % 2 !== 0) {
              return (
                <>
                  <div>
                    <Typography display="inline">{value.tag}: </Typography>
                    <Typography
                      display="inline"
                      dangerouslySetInnerHTML={{
                        __html: value.activity_mvc.html,
                      }}
                    ></Typography>
                  </div>
                  <div>
                    <br />
                  </div>
                </>
              );
            } else {
              return (
                <>
                  <div>
                    <Typography display="inline">
                      <strong>{value.tag}</strong>:{" "}
                    </Typography>
                    {displayInterviewee(value.activity_mvc, key)}
                  </div>
                  <div>
                    <br />
                  </div>
                </>
              );
            }
          })}
        </Box>
        <Button
          sx={{ marginTop: 3, marginBottom: 3 }}
          fullWidth
          type="submit"
          variant="outlined"
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Act2;
