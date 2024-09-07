export const socketFunc = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected => ${socket.id}`);

    socket.on("join_room", (jobId: string) => {
      socket.join(jobId);
      console.log(`User with ID ${socket.id} joined room ${jobId}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};
