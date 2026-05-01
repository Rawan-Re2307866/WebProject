import prisma from "@/repos/prisma";

export async function create(data){
    try{
        const result = await prisma.comment.create({
            data,
            include: {user:true},
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
        return await prisma.comment.delete({
            where: {id},
        });

    }catch(e){
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}


