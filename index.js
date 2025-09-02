const expresss = require("express");
const app = expresss();
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

app.use("/user", userRouter);
app.use("/ourse", courseRouter);
app.use("/admin", adminRouter);



app.listen(3000);
