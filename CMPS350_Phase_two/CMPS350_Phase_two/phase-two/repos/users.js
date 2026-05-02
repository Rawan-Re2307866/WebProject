import prisma from "@/repos/prisma";


export async function read(id) {
  try {
    if (id) {
      const data = await prisma.user.findUnique({
        where: { id },
        include: { followers: true, following: true, posts: true },
      });
      if (!data) return { error: { message: "User not found.", status: 404 } };
      return { data };
    }
    const data = await prisma.user.findMany({
      include: { followers: true, following: true, posts: true },
    });
    return { data };
  } catch (e) {
    return { error: { message: e.message, status: 500 } };
  }
}

export async function readByUsername(username) {
  try {
    const data = await prisma.user.findUnique({
      where: { username },
      include: { followers: true, following: true, posts: true },
    });
    if (!data) return { error: { message: "User not found.", status: 404 } };
    return { data };
  } catch (e) {
    return { error: { message: e.message, status: 500 } };
  }
}

export async function create(data) {
  try {
    
    const result = await prisma.user.create({ data });

    return { data: result };
  } catch (e) {
    if (e.code === "P2002") {
      return { error: { message: "Username or email already exists.", status: 409 } };
    }
    return { error: { message: e.message, status: 500 } };
  }
}

export async function update(id, data) {
  try {
    const result = await prisma.user.update({ where: { id }, data });
    return { data: result };
  } catch (e) {
    return { error: { message: e.message, status: 500 } };
  }
}

export async function remove(id) {
  try {
    
    const posts = await prisma.post.findMany({ where: { userId: id } });
    const postIds = posts.map(p => p.id);

    if (postIds.length > 0) {
      await prisma.like.deleteMany({ where: { postId: { in: postIds } } });
      await prisma.comment.deleteMany({ where: { postId: { in: postIds } } });
    }

    await prisma.like.deleteMany({ where: { userId: id } });
    await prisma.comment.deleteMany({ where: { userId: id } });

    await prisma.follow.deleteMany({
      where: { OR: [{ followerId: id }, { followingId: id }] }
    });


    await prisma.post.deleteMany({ where: { userId: id } });

    const data = await prisma.user.delete({ where: { id } });
    return { data };
  } catch (e) {
    console.error("Remove user error:", e.message);
    return { error: { message: e.message, status: 500 } };
  }
}

export async function search(username) {
  try {
    const data = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
      },
    });

    return { data };
  } catch (e) {
    return {
      error: {
        message: e.message,
        status: 500,
      },
    };
  }
}