import { Emitter } from "../../utils/websocket"; // Import the WebSocket Emitter used to listen to events

interface ProductEventData {
  event: string;
  data: {
    data: {
      attributes: {
        pID: string;
      };
    };
  };
}

// Asynchronous GET handler function for returning a stream of events.
export async function GET() {
  console.log("stream.js> get()"); // Log to indicate the stream GET request is initiated.

  let eventsListener: (data: ProductEventData) => void; // Declare a variable to hold the event listener.

  // Create a new ReadableStream for server-sent events (SSE).
  const stream = new ReadableStream({
    // This function is called when the stream is first initialized.
    start(controller: ReadableStreamDefaultController) {
      // Define an event listener that handles WebSocket events.
      eventsListener = (data: any) => {
        console.log(
          `stream.js> Emitter event = ${data.event}, id = ${data.data.data.attributes.pID}`
        );

        // Format the event data to be sent in the SSE format.
        const eventData = `data: ${JSON.stringify(data)}\r\n\r\n`;

        // Enqueue the formatted event data to be sent to the client.
        controller.enqueue(eventData);
      };

      // Remove any previous listeners for product events (create, update, delete).
      Emitter.off("product:create", eventsListener);
      Emitter.off("product:update", eventsListener);
      Emitter.off("product:delete", eventsListener);

      // Attach listeners to the WebSocket Emitter for product events (create, update, delete).
      Emitter.on("product:create", eventsListener);
      Emitter.on("product:update", eventsListener);
      Emitter.on("product:delete", eventsListener);
    },

    // This function is called if the stream is canceled by the client.
    cancel() {
      console.log("stream.js> cancel()");

      // Remove the attached listeners for product events when the stream is canceled.
      Emitter.removeListener("product:create", eventsListener);
      Emitter.removeListener("product:update", eventsListener);
      Emitter.removeListener("product:delete", eventsListener);
    },
  });

  // Return the ReadableStream as a response to the client, sending events as SSE.
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream", // Content type for SSE.
      Connection: "keep-alive", // Keep the connection open to send events continuously.
      "Cache-Control": "no-cache", // Prevent caching of the response.
    },
  });
}

// Note: The SSE is implemented in order to minimize the use of js on client side.
