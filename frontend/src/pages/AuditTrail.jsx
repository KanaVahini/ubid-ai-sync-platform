import { useEffect, useState } from "react"
import axios from "axios"

function AuditTrail() {

  const [logs, setLogs] = useState([])

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

  useEffect(() => {

    const loadData = async () => {

      await fetchLogs()

    }

    loadData()

    const interval = setInterval(() => {

      fetchLogs()

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
          fontSize: "50px",
          marginBottom: "10px"
        }}
      >
        Audit Trail
      </h1>

      <p
        style={{
          color: "#ccc",
          marginBottom: "40px"
        }}
      >
        Government-grade event traceability and compliance monitoring
      </p>


      <div
        style={{
          overflowX: "auto"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111111",
            borderRadius: "20px",
            overflow: "hidden"
          }}
        >

          <thead
            style={{
              background: "#ffcc00",
              color: "black"
            }}
          >

            <tr>

              <th style={thStyle}>
                Event ID
              </th>

              <th style={thStyle}>
                UBID
              </th>

              <th style={thStyle}>
                Source
              </th>

              <th style={thStyle}>
                Target
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Timestamp
              </th>

              <th style={thStyle}>
                AI Resolution
              </th>

            </tr>

          </thead>


          <tbody>

            {
              logs.map((log, index) => (

                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #222"
                  }}
                >

                  <td style={tdStyle}>
                    {log.event_id.slice(0, 8)}...
                  </td>

                  <td style={tdStyle}>
                    {log.ubid}
                  </td>

                  <td style={tdStyle}>
                    {log.source}
                  </td>

                  <td style={tdStyle}>
                    {log.target}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color:
                        log.status === 200
                          ? "#22c55e"
                          : "#ef4444",
                      fontWeight: "bold"
                    }}
                  >
                    {log.status}
                  </td>

                  <td style={tdStyle}>
                    {
                      new Date(
                        log.timestamp
                      ).toLocaleTimeString()
                    }
                  </td>

                  <td style={tdStyle}>

                    {
                      log.payload?.ai_explanation
                        ? (
                          <span
                            style={{
                              background: "#ffcc00",
                              color: "black",
                              padding: "8px 12px",
                              borderRadius: "10px",
                              fontWeight: "bold"
                            }}
                          >
                            AI RESOLVED
                          </span>
                        )
                        : (
                          <span
                            style={{
                              color: "#999"
                            }}
                          >
                            Normal
                          </span>
                        )
                    }

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </div>

  )
}

const thStyle = {

  padding: "18px",
  textAlign: "left"

}

const tdStyle = {

  padding: "18px",
  color: "#ddd"

}

export default AuditTrail