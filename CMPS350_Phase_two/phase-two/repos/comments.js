import prisma from "@/repos/prisma";

export async function create(data) {
    try {
        const result = await prisma.comment.create({
            data,
            include: { user: true },
        });
        return { data: result };
    } catch (e) {
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}

export async function remove(id) {
    try {
        return await prisma.comment.delete({
            where: { id },
        });

    } catch (e) {
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }

}

export async function read(id) {
    try {
        const data = await prisma.comment.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!data) {
            return {
                error: {
                    message: "Comment not found",
                    status: 404
                }
            };
        }
        return { data };

    } catch (e) {
        return {
            error: {
                message: e.message,
                status: 500
            }
        };
    }
}


