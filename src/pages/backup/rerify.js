// export default async function handler(req, res) {
//   const { content } = req.body; // Destructure both properties from req.body

//   try {
//     // const verifyResponse = await fetch(flaskApiUrl, {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({
//     //     content: content, // Use the destructured variable
//     //   }),
//     // });
//     const verifyResponse = await fetch("http://localhost:5000/api/verify", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: "Your content here" }),
//     });
//     console.log("Sending content to Flask API:", { content });

//     if (!verifyResponse.ok) {
//       throw new Error("Failed to verify locations");
//     }

//     const verifyData = await verifyResponse.json();
//     res.status(200).json(verifyData);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "500 - Failed to verify locations" });
//   }
// }
