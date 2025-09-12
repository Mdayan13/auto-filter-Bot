import { Context } from "grammy";
import { User } from "./userSchema";
import mongoose from "mongoose";

export const StoreUserInDb = async(ctx: Context) => {
    if(!ctx.from) return;

    const existing = await User.findOne({
        userId: ctx.from.id
    });
    if(existing){
        console.log("ok user already exist");
        return
    }
    try {
        const user = await User.create({
            userId: ctx.from.id,
            isBot: ctx.from.is_bot,
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
            userName: ctx.from.username,
        });
        return user;
    } catch (error :any) {
        console.log(`failed to store user in data base beacuse of ${error.message}`)
    }
}
export const totalBotUser = async() => {
    const users = await User.countDocuments({isBot: false});
    console.log("returinnng the totalUser for", users.toFixed)
    return users
}
export const totalPremiunUser = async() => {
    const users = await User.countDocuments({isPremium: true});
    console.log("returinnng the premium User for", users.toFixed)
    return users
}