// import type { APIRoute } from "astro";
// import { z } from "zod";
// import { strapi } from "../../utils/constants";

// export const POST: APIRoute = async ({ request }) => {
//   const schema = z
//     .object({
//       email: z.string().email(),
//       username: z.string().min(3),
//       password: z.string().min(8),
//       confirmPassword: z.string().min(8),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Passwords don't match",
//       path: ["confirmPassword"],
//     });

//   const body = await request.json();
//   const result = schema.safeParse(body);

//   if (!result.success) {
//     return new Response(
//       JSON.stringify({ message: result.error.errors[0].message }),
//       { status: 400 }
//     );
//   }

//   try {
//     const strapiResponse = await fetch(strapi.SIGNUP_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         username: body.username,
//         email: body.email,
//         password: body.password,
//       }),
//     });

//     const strapiData = await strapiResponse.json();

//     if (!strapiResponse.ok) {
//       return new Response(
//         JSON.stringify({ message: strapiData.error.message }),
//         { status: 400 }
//       );
//     }

//     return new Response(JSON.stringify(strapiData), { status: 200 });
//   } catch (error) {
//     return new Response(
//       JSON.stringify({
//         message: "An unexpected error occurred. Please try again.",
//       }),
//       { status: 500 }
//     );
//   }
// };
