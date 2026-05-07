import { useEffect, useState } from "react"
import axios from "axios"

function ConflictCenter() {

  const [conflicts, setConflicts] = useState([])

  const fetchConflicts = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/audit"
      )

      const filtered = response.data.filter(
        log => log.payload?.ai_explanation
      )

      setConflicts(filtered.reverse())

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

  const loadData = async () => {

    await fetchConflicts()

  }

  loadData()

  const interval = setInterval(() => {

    fetchConflicts()

  }, 3000)

  return () => clearInterval(interval)

}, [])


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          color: "#ffcc00",
          fontSize: "50px"
        }}
      >
        AI Conflict Center
      </h1>

      <p
        style={{
          color: "#ccc",
          marginBottom: "40px"
        }}
      >
        Explainable AI Governance Decisions
      </p>


      {
        conflicts.map((conflict, index) => (

          <div
            key={index}
            style={{
              background: "#111111",
              border: "1px solid #2d2d2d",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "25px"
            }}
          >

            <h2 style={{ color: "#ffcc00" }}>
              ⚠ Conflict Detected
            </h2>

            <p>
              UBID:
              <span style={{ color: "#ffcc00" }}>
                {" "} {conflict.ubid}
              </span>
            </p>


            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "20px"
              }}
            >

              <div
                style={{
                  background: "#1a1a1a",
                  padding: "20px",
                  borderRadius: "16px"
                }}
              >

                <h3>AI Decision</h3>

                <p>
                  Winner:
                  <span
                    style={{
                      color: "#ffcc00",
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    {
                      conflict.payload.ai_explanation.winner
                    }
                  </span>
                </p>

                <p>
                  Confidence:
                  <span
                    style={{
                      color: "#22c55e",
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    {
                      Math.round(
                        conflict.payload.ai_explanation.confidence * 100
                      )
                    }%
                  </span>
                </p>

              </div>


              <div
                style={{
                  background: "#1a1a1a",
                  padding: "20px",
                  borderRadius: "16px"
                }}
              >

                <h3>AI Reasoning</h3>

                {
                  conflict.payload.ai_explanation.reason.map(
                    (reason, i) => (

                      <p key={i}>
                        • {reason}
                      </p>

                    )
                  )
                }

              </div>

            </div>


            <div
              style={{
                marginTop: "25px",
                background: "#1a1a1a",
                padding: "20px",
                borderRadius: "16px"
              }}
            >

              <h3 style={{ color: "#ffcc00" }}>
                AI Decision Pipeline
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "20px",
                  flexWrap: "wrap"
                }}
              >

                <div style={boxStyle}>
                  Incoming Event
                </div>

                <div style={arrowStyle}>→</div>

                <div style={boxStyle}>
                  Conflict Detection
                </div>

                <div style={arrowStyle}>→</div>

                <div style={boxStyle}>
                  Trust Evaluation
                </div>

                <div style={arrowStyle}>→</div>

                <div style={boxStyle}>
                  AI Resolution
                </div>

              </div>

            </div>

          </div>

        ))
      }

    </div>

  )
}

const boxStyle = {

  background: "#101010",
  border: "1px solid #333",
  padding: "14px 20px",
  borderRadius: "14px",
  color: "#ffcc00",
  fontWeight: "bold"

}

const arrowStyle = {

  color: "#ffcc00",
  fontSize: "24px",
  fontWeight: "bold"

}

export default ConflictCenter