import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";

export const emailRouter = createRouter({
  sendApproval: publicQuery
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Use the Kimi Mail API to send emails
      try {
        const response = await fetch("https://api.moonshot.cn/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.APP_SECRET}`,
          },
          body: JSON.stringify({
            to: input.to,
            subject: input.subject,
            body: input.body,
            from: "support@equityspringgroup.com",
          }),
        });

        if (!response.ok) {
          // Fallback: log the email for development
          console.log("Approval email to:", input.to);
          console.log("Subject:", input.subject);
          console.log("Body:", input.body);
          return { success: true, message: "Email logged (mail service unavailable)" };
        }

        return { success: true, message: "Email sent successfully" };
      } catch {
        console.log("Approval email to:", input.to);
        console.log("Subject:", input.subject);
        console.log("Body:", input.body);
        return { success: true, message: "Email logged (mail service unavailable)" };
      }
    }),

  sendAdminCustom: publicQuery
    .input(
      z.object({
        pin: z.string(),
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.pin !== "32074319680") {
        throw new Error("Invalid admin PIN");
      }

      try {
        const response = await fetch("https://api.moonshot.cn/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.APP_SECRET}`,
          },
          body: JSON.stringify({
            to: input.to,
            subject: input.subject,
            body: input.body,
            from: "support@equityspringgroup.com",
          }),
        });

        if (!response.ok) {
          console.log("Custom approval email to:", input.to);
          console.log("Subject:", input.subject);
          console.log("Body:", input.body);
          return { success: true, message: "Email logged (mail service unavailable)" };
        }

        return { success: true, message: "Email sent successfully" };
      } catch {
        console.log("Custom approval email to:", input.to);
        console.log("Subject:", input.subject);
        console.log("Body:", input.body);
        return { success: true, message: "Email logged (mail service unavailable)" };
      }
    }),
});
