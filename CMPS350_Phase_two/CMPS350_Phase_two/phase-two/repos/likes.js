import prisma from "@/repos/prisma";

export async function toggle(userId, postId){
    try{

        const existing = await prisma.like.findUnique({
            where: {userId_postId : {userId , postId}},
        });
        if(existing){
            const result = await prisma.like.delete({
                where: { userId_postId : {userId,postId}}
            });
            return {data:result , liked: false};
        }
        const data = await prisma.like.create({
            data: {userId, postId}
        });
        return {data , liked: true};

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}




