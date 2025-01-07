"use server";

import { auth } from "@/auth";
import FlashService, { FlashPageableOptions } from "@/domain/flash/service";
import { Prisma } from "@prisma/client";

const flashService = new FlashService();

export const getFlash = async (id: string) => {
  return await flashService.getFlash(id);
};

export const getFlashes = async (options: FlashPageableOptions) => {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized");

  return await flashService.getFlashes(options);
};

export const createFlash = async (flash: Prisma.FlashCreateInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  flash.author = { connect: { id: session.user.id } };
  return await flashService.createFlash(flash);
};

export const updateFlash = async (id: string, flash: Prisma.FlashUpdateInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await flashService.verifyFlashOwner(id, session.user.id);
  return await flashService.updateFlash(id, flash);
};

export const deleteFlash = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await flashService.verifyFlashOwner(id, session.user.id);
  return await flashService.deleteFlash(id);
};

export const likeFlash = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await flashService.likeFlash(id, session.user.id);
};

export const unlikeFlash = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await flashService.unlikeFlash(id, session.user.id);
};