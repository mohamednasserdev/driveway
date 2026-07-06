const Spinner = ({ size = 40, message = "Loading..." }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem",
      gap: "1rem",
    }}
  >
    <div
      style={{
        width: size,
        height: size,
        border: "3px solid #e2e8f0",
        borderTopColor: "#3b82f6",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    {message && (
      <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
        {message}
      </p>
    )}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
