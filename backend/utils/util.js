
// utils/calculateRemainingPlanDays.js
import nodemailer from "nodemailer"

// export function calculateRemainingPlanDays(user) {
//   if (!user?.isPlanActive || !user?.planStartDate || !user?.planDuration) {
//     return 0;
//   }

//   const now = new Date();
//   const start = new Date(user.planStartDate);
//   const elapsedMs = now.getTime() - start.getTime();
//   const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

//   const remainingDays = user.planDuration - elapsedDays;
//   return remainingDays > 0 ? remainingDays : 0;
// }

export function calculateRemainingPlanDays(user) {
  if (!user?.isPlanActive || !user?.planStartDate || !user?.planDuration) {
    return 0;
  }

  const now = new Date();
  const startDate = new Date(user.planStartDate);

  let elapsedMs = now.getTime() - startDate.getTime();

  // Subtract freeze durations
  if (user.freezePeriods && user.freezePeriods.length > 0) {
    user.freezePeriods.forEach(period => {
      const freezeStart = new Date(period.start);
      const freezeEnd = period.end ? new Date(period.end) : now; // ongoing freeze
      const overlapStart = freezeStart > startDate ? freezeStart : startDate;
      const overlapEnd = freezeEnd < now ? freezeEnd : now;

      const freezeDuration = Math.max(0, overlapEnd.getTime() - overlapStart.getTime());
      elapsedMs -= freezeDuration;
    });
  }

  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const remainingDays = user.planDuration - elapsedDays;

  return remainingDays > 0 ? remainingDays : 0;
}



export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_ADMIN,
      pass: process.env.EMAIL_ADMIN_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ScandiFans" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};