import prisma from "@/repos/prisma";


export async function getAvgFollowerPerUser(){
    try{
        const users = await prisma.user.findMany({
            select: {
                _count: {
                    select: {followers: true}
                }
            }
        });        
        const totalUsers = users.length;
        if (totalUsers === 0) return {data: 0};
        const totalFollowers = users.reduce((sum, user) => sum +user._count.followers,0);
        const avgFollowers = totalFollowers/totalUsers;
        return {data: avgFollowers.toFixed(2)};
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}
export async function getAvgFollowingPerUser(){
    try{
        const users = await prisma.user.findMany({
            select: {
                _count:{
                    select: {following: true}
                }
            }
        });

        const totalUsers = users.length;
        if(totalUsers === 0) return {data: 0};
        const totalFollowing = users.reduce((sum,user) => sum+user._count.following,0);
        const avgFollowing = (totalFollowing/totalUsers);
        return {data: avgFollowing.toFixed(2) };

        
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}
export async function getAvgPostsPerUser(){
    try{
        const users = await prisma.user.findMany({
            select:{
                _count: {
                    select: {posts:true}
                }
            }
        });
        const totalUsers = await prisma.user.count();
        if (totalUsers===0) return {data:0};
        const totalPosts = users.reduce((sum,user)=> sum + user._count.posts,0);
        const avg = (totalPosts/totalUsers);
        return{data: avg.toFixed(2)}; 
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}
export async function getMostActiveUser(){
    try{
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const result = await prisma.post.groupBy({
            by: ["userId"],
            where: {createdAt: {gte:sixMonthsAgo}},
            _count: {id:true},
            orderBy: {_count: {id:"desc"}},
            take: 1,
        });

        if(result.length === 0) return {data : null};
        const user = await prisma.user.findUnique({
            where : {id: result[0].userId},
        });
        return {data: {user, postCount: result[0]._count.id}}
        
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}
export async function getMostLikedPost(){
    try{
        const post = await prisma.post.findFirst({
            include: {
                user: true,
                _count: {select: {likes:true}},
            },
            orderBy: {likes: {_count:"desc"}},
        });
        return {data:post};
        
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}
export async function getMostCommentedPost(){
    try{
        const post = await prisma.post.findFirst({
            include: {
                user:true,
                _count: {select: {comments:true}},
            },
            orderBy: {comments: {_count: "desc"}},
        });
        return {data: post};
        
    }catch(e){
        return {
            error: {
                message:e.message,
                status: 500,
            }
        };
    }
}