
import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"



export const sendWelcomeEmail = async(email, name, clientURL) => {
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "welcome to chat",
        html: createWelcomeEmailTemplate(name, clientURL)
    })
    if(error){
        console.error("Error sending the welcome email", error)
        throw new Error("Failed to send the welcome email")
    }
    console.log("welcome email sent successfully", data)
}