import prisma from "@/repos/prisma";


export async function getStats(){
    try{
        const totalUsers = await prisma.user.count();
        
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}