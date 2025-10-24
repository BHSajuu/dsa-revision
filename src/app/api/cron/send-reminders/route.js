import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { sendEmail } from "../../../../../lib/notifications";


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Disable caching for this API route to ensure it runs every time
export const revalidate = 0;

export async function GET(_request) {
  try {
   
    const today = new Date().toISOString().split("T")[0];
    
    console.log(`Cron job running for date: ${today}`);

    // Fetch all problems due for review today using the new Convex query
    const problemsToReview = await convex.query(api.problems.getProblemsForReminder, { today });

    if (!problemsToReview || problemsToReview.length === 0) {
      console.log("No problems due for review today.");
      return NextResponse.json({ message: "No problems due for review today." });
    }

    console.log(`Found ${problemsToReview.length} problems to review.`);

    //  Group problems by user ID to send one email per user
    const problemsByUser = problemsToReview.reduce((acc, problem) => {
      const { userId } = problem;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(problem);
      return acc;
    }, {});

    let emailsSentCount = 0;

    //  Iterate over each user and send them their personalized email
    for (const userId in problemsByUser) {
      const userProblems = problemsByUser[userId];
      
      // Fetch the user's details using the new Convex query
      const user = await convex.query(api.users.getUserById, { userId });

      if (user && user.email) {
        const userName = user.name || "there";
        const subject = `DSA Revision Reminder: You have ${userProblems.length} problem(s) to review today!`;

        // Generate an HTML list of the problems
        const problemListHtml = userProblems
          .map(
            (p) =>
              `<li style="margin-bottom: 10px;">
                 <a href="${p.leetcodeLink}" target="_blank" style="color: #007BFF; text-decoration: none; font-weight: bold;">
                   ${p.problemName}
                 </a>
               </li>`
          )
          .join("");

      
        const html = `
          <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4F46E5; color: white; padding: 20px;">
              <h2 style="margin: 0;">DSA Review Reminder</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
              <p style="font-size: 16px; color: #333; line-height: 1.5;">
                This is a friendly reminder that the following problems are scheduled for your review today.
              </p>
              <ul style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 20px; list-style-type: none; margin: 20px 0;">
                ${problemListHtml}
              </ul>
              <p style="font-size: 16px; color: #333; line-height: 1.5;">
                Keep up the great work and happy coding!
              </p>
            </div>
            <div style="background-color: #f4f4f4; color: #888; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">This is an automated reminder from your DSA Revision App.</p>
            </div>
          </div>
        `;

        
        await sendEmail(user.email, subject, html);
        emailsSentCount++;
        console.log(`Sent reminder email to: ${user.email}`);

      } else {
        console.warn(`Could not find user or user email for userId: ${userId}`);
      }
    }

    return NextResponse.json({
      message: "Cron job completed.",
      emailsSent: emailsSentCount,
      usersToNotify: Object.keys(problemsByUser).length,
    });

  } catch (error) {
    console.error("Error in /api/cron/send-reminders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
