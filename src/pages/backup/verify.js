export default async function handler(req, res) {
  const { content } = req.body; // Assuming the content is sent in the request body

  try {
    const verifyResponse = await fetch("http://localhost:3000/admin/test", {
      // Change the URL to your Flask API endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!verifyResponse.ok) {
      throw new Error("Failed to verify locations");
    }

    const verifyData = await verifyResponse.json();
    res.status(200).json(verifyData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to verify locations" });
  }
}
