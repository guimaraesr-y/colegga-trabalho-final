/* istanbul ignore file */

export interface MockFlashDataInterface {
  id?: string;
  title?: string;
  content?: string;
  authorId?: string;
}

/**
* Creates a mock flash object with the given title, content, and authorId.
* If any of the parameters are not provided, it will use default values.
*/
export const mockFlashData = (data?: MockFlashDataInterface) => ({
  id: data?.id ? data?.id : "123",
  title: data?.title || "Default Title",
  content: data?.content || "Default Content",
  authorId: data?.authorId || "defaultAuthorId",
  author: { id: data?.authorId || "defaultAuthorId", name: "Default Author" },
  createdAt: new Date(),
  updatedAt: new Date(),
});
