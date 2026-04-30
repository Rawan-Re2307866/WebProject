import prisma from "@/repos/prisma";

export async function readAll(userId) {
    try {
        if (userId) {
            const data = await prisma.post.findMany({
                where: { userId },
                include: {
                    user: true,
                    likes: true,
                    comments: { include: { user: true } },
                },
                orderBy: { createdAt: "desc" },
            });
            return { data };
        } else{
        const data = await prisma.post.findMany({
            include: {
                user: true,
                likes: true,
                comments: { include: { user: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return {data}; 
    }
    } catch (e) {
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }
}

export async function readFeed(userId){
    try{
        const following = await prisma.follow.findMany({
            where: { followerId: userId}
        });
        const followingIds = following.map((f)=> f.followingId)
        const data= await prisma.post.findMany({
            where: {userId: {in: followingIds}},
            include: {
                user: true,
                likes:true,
                comments: {include: {user:true}},
            },
            orderBy : {createdAt : "desc"},
        });

        return {data};

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }
}
export async function read(id){
    try{
        const data = prisma.post.findUnique({
            where: {id},
            include: {
                user:true,
                likes:true,
                comments: {include: {user}},
            },
        });
        if(!data) {
            return {
                error: {
                    message: "Post not found", status:404
                }
            };
        };

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}

export async function create(data){
    try{
        const result = await prisma.post.create({
            data,
            include:{
                user:true,
                likes:true,
                comments: true
            },
        });
        return {data : result};

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}
export async function update(id, data){
    try{
        const result = await prisma.post.update({
            where: {id},
            data
        });
        return {data:result};

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }
}
export async function remove(id){
    try{
        await prisma.comment.deleteMany({
            where: {postId:id},
        });
        await prisma.like.deleteMany({
            where: {postId: id},
        });
        const result = await prisma.post.delete({
            where: {id},
        });
        return {data};

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}
/*
    try{

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }
*/