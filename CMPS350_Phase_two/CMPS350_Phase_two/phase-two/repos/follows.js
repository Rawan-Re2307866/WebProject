import prisma from "@/repos/prisma";

export async function toggle(followerId,followingId){
    try{
        const existing = await prisma.follow.findUnique({
            where: { followerId_followingId : {followerId,followingId}},
        });
        if (existing){
            const result = await prisma.follow.delete({
                where: {followerId_followingId : {followerId,followingId}},
            });
            return {data:result, following:false};
        }

        const data = await prisma.follow.create({
            data: {followerId,followingId},
        });
        return {data, following: true};

    }catch(e){
        
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}


