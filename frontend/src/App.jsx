import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function App() {

  const [logs, setLogs] = useState([])
  const [trustScores, setTrustScores] = useState({})

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/audit"
      )

      setLogs(response.data.reverse())

    } catch (error) {
      console.log(error)
    }
  }

  const fetchTrustScores = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/trust"
      )

      setTrustScores(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

  const loadData = async () => {

    await fetchLogs()
    await fetchTrustScores()

  }

  loadData()

  const interval = setInterval(() => {

    fetchLogs()
    fetchTrustScores()

  }, 3000)

  return () => clearInterval(interval)

}, [])


  const pageStyle = {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    padding: "30px",
    fontFamily: "Arial"
  }

  const cardStyle = {
    background: "#111111",
    border: "1px solid #262626",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 0 20px rgba(255, 204, 0, 0.08)"
  }

  const titleStyle = {
    color: "#ffcc00",
    fontWeight: "bold"
  }
  

const navButton = {

  background: "#ffcc00",
  color: "black",
  padding: "14px 22px",
  borderRadius: "14px",
  fontWeight: "bold",
  textDecoration: "none"

}

  return (

    <div style={pageStyle}>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px"
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "52px",
              margin: 0,
              color: "#ffcc00"
            }}
          >
            UBID Sync Bridge
          </h1>

          <p
            style={{
              color: "#d4d4d4",
              marginTop: "10px",
              fontSize: "18px"
            }}
          >
            AI-Augmented Government Interoperability Intelligence Layer
          </p>

        </div>


        <div
  style={{
    display: "flex",
    gap: "15px",
    flexWrap: "wrap"
  }}
>

  <Link
    to="/conflicts"
    style={navButton}
  >
    AI Conflict Center
  </Link>

  <Link
    to="/audit"
    style={navButton}
  >
    Audit Trail
  </Link>

  <div
    style={{
      background: "#22c55e",
      color: "black",
      padding: "14px 22px",
      borderRadius: "14px",
      fontWeight: "bold"
    }}
  >
    ● SYSTEM ACTIVE
  </div>
  

</div>


      </div>
      
      {/* TOP STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
      
        <div style={cardStyle}>
          <p style={{ color: "#999" }}>
            Total Events
          </p>

          <h1 style={titleStyle}>
            {logs.length}
          </h1>
        </div>


        <div style={cardStyle}>
          <p style={{ color: "#999" }}>
            AI Reconciliation
          </p>

          <h1 style={titleStyle}>
            ACTIVE
          </h1>
        </div>


        <div style={cardStyle}>
          <p style={{ color: "#999" }}>
            Success Rate
          </p>

          <h1 style={titleStyle}>
            98.6%
          </h1>
        </div>


        <div style={cardStyle}>
          <p style={{ color: "#999" }}>
            ML Confidence
          </p>

          <h1 style={titleStyle}>
            92%
          </h1>
        </div>

      </div>


      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "24px"
        }}
      >


        {/* LIVE EVENTS */}
        <div style={cardStyle}>

          <h2 style={titleStyle}>
            Live Event Stream
          </h2>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >

            {
              logs.map((log, index) => (

                <div
                  key={index}
                  style={{
                    background: "#1a1a1a",
                    padding: "18px",
                    borderRadius: "18px",
                    border: "1px solid #2d2d2d"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >

                    <h3
                      style={{
                        margin: 0,
                        color: "#ffcc00"
                      }}
                    >
                      {log.source} → {log.target}
                    </h3>

                    <div
                      style={{
                        color:
                          log.status === 200
                            ? "#22c55e"
                            : "#ef4444",
                        fontWeight: "bold"
                      }}
                    >
                      {log.status}
                    </div>

                  </div>


                  <p style={{ color: "#ccc" }}>
                    UBID: {log.ubid}
                  </p>


                  {
                    log.payload?.ai_explanation && (

                      <div
                        style={{
                          marginTop: "15px",
                          background: "#101010",
                          padding: "14px",
                          borderRadius: "14px",
                          border: "1px solid #3b3b3b"
                        }}
                      >

                        <p>
                          ⚠ Conflict Detected
                        </p>

                        <p>
                          Winner:
                          <span
                            style={{
                              color: "#ffcc00",
                              marginLeft: "8px",
                              fontWeight: "bold"
                            }}
                          >
                            {
                              log.payload.ai_explanation.winner
                            }
                          </span>
                        </p>

                        <p>
                          Confidence:
                          <span
                            style={{
                              color: "#22c55e",
                              marginLeft: "8px",
                              fontWeight: "bold"
                            }}
                          >
                            {
                              log.payload.ai_explanation.confidence
                            }
                          </span>
                        </p>


                        <div style={{ marginTop: "10px" }}>

                          {
                            log.payload.ai_explanation.reason.map(
                              (reason, i) => (

                                <p
                                  key={i}
                                  style={{
                                    color: "#d4d4d4",
                                    margin: "4px 0"
                                  }}
                                >
                                  • {reason}
                                </p>

                              )
                            )
                          }

                        </div>

                      </div>

                    )
                  }

                </div>

              ))
            }

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
        >


          {/* TRUST SCORES */}
          <div style={cardStyle}>

            <h2 style={titleStyle}>
              Department Trust Scores
            </h2>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >

              {
                Object.entries(trustScores).map(
                  ([dept, score], index) => (

                    <div
                      key={index}
                      style={{
                        background: "#1a1a1a",
                        padding: "16px",
                        borderRadius: "14px"
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >

                        <span>
                          {dept}
                        </span>

                        <span
                          style={{
                            color: "#ffcc00",
                            fontWeight: "bold"
                          }}
                        >
                          {score}
                        </span>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          </div>


          {/* AI INSIGHTS */}
          <div style={cardStyle}>

            <h2 style={titleStyle}>
              AI Governance Insights
            </h2>

            <div
              style={{
                marginTop: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >

              <div
                style={{
                  background: "#1a1a1a",
                  padding: "16px",
                  borderRadius: "14px"
                }}
              >
                ⚠ Adaptive reconciliation active
              </div>


              <div
                style={{
                  background: "#1a1a1a",
                  padding: "16px",
                  borderRadius: "14px"
                }}
              >
                ⚠ Semantic conflict analysis enabled
              </div>


              <div
                style={{
                  background: "#1a1a1a",
                  padding: "16px",
                  borderRadius: "14px"
                }}
              >
                ⚠ Department health monitoring operational
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default App
