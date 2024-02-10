// import { PythonShell } from "python-shell";

// export default async function handler(req, res) {
//   const { content } = req.body; // Assuming the content is sent in the request body

//   const options = {
//     scriptPath:
//       "C:\\Users\\dstee\\Desktop\\Codes\\Github_projects\\mapswithmeaning\\flask_app",
//     args: [content],
//   };

//   PythonShell.run("verify.py", options, (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to verify locations" });
//     } else {
//       const locations = results.map((location) => location.trim());
//       res.status(200).json({ locations });
//     }
//   });
// }
