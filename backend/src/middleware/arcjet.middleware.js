
import aj from "../lib/arcject.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async(req, res, next) => {
    try {
        const decision = await aj.protect(req)
        if (decision.isDenied()){
            if (decision.reason.isRateLimit()){
                res.status(429).json({message:"Rate limit exceeded. please try agian later"})
            }

         else if (decision.reason.isBot()){
            return res.status(403).json({message:"Bot access is denied"})
        } else{
            return res.status(403).json({message:"Access deneid by security"})
        }
    }

    // spoofed bots
    if (decision.results.some(isSpoofedBot)){
        return res.status(403).json({
            error:"spoofed boys detected",
            message:"Malicious bot atcivities"
        })
    }
    next()

    } catch (error) {
        console.error("Arjetc middleware prob", error)
        return res.status(500).json({message:"Server failed"})
    }
}