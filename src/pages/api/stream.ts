import { Emitter } from "../../utils/websocket"; // Assuming your WebSocket setup exports Emitter

export async function GET() {
  console.log("stream.js> get()");

  let eventsListener: any;

  const stream = new ReadableStream({
    start(controller) {
      eventsListener = (data: any) => {
        console.log(`stream.js> Emitter event = ${JSON.stringify(data)}`);
        const eventData = `data: ${JSON.stringify(data)}\r\n\r\n`;
        controller.enqueue(eventData);
      };
      Emitter.off("product:create", eventsListener);
      Emitter.off("product:update", eventsListener);
      Emitter.off("product:delete", eventsListener);
      Emitter.on("product:create", eventsListener);
      Emitter.on("product:update", eventsListener);
      Emitter.on("product:delete", eventsListener);
    },
    cancel() {
      console.log("stream.js> cancel()");
      Emitter.removeListener("product:create", eventsListener);
      Emitter.removeListener("product:update", eventsListener);
      Emitter.removeListener("product:delete", eventsListener);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
