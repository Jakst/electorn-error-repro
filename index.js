const { app } = require("electron");
const { fork } = require("child_process");
const fs = require("fs");
const path = require("path");

const sharpBuildPath = path.join(
  __dirname,
  "result-project/node_modules/sharp/build"
);

app.on("ready", () => {
  runYarnInstall();
});

function runYarnInstall() {
  const child = fork(
    path.join(__dirname, "./yarn.js"),
    ["--cwd", path.join(__dirname, "result-project")],
    { silent: true }
  );

  child.stdout.on("data", chunk => {
    console.log(chunk.toString());
  });

  child.stdout.on("close", () => {
    console.log("Contents of", sharpBuildPath);
    console.log("Exptected:", ["Release"], "(with 'sharp.node' inside)");

    fs.readdir(sharpBuildPath, (_, files) => {
      console.log("Actual:", files);
    });

    app.quit();
  });
}
