import { jest } from "@jest/globals";
import BCrypt from "@/lib/bcrypt";
import AuthService from "@/domain/auth/authService";
import { PrismaClient } from "@prisma/client";
import { mockUserData } from "../../utils/authHelper";

jest.mock("@/lib/bcrypt.ts", () => ({
  compare: jest.fn() as jest.MockedFunction<typeof BCrypt.compare>,
  hash: jest.fn() as jest.MockedFunction<typeof BCrypt.hash>,
}));

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

describe("AuthService", () => {
  const authService = new AuthService(mockPrisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if user is not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    expect(
      authService.login({ email: "test@example.com", password: "12345678" })
    ).rejects.toThrow(Error);
  });

  it("should throw an error if password is invalid", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUserData());
    (BCrypt.compare as jest.MockedFunction<typeof BCrypt.compare>).mockReturnValue(false);

    expect(
      authService.login({ email: "test@example.com", password: "wrongpass" })
    ).rejects.toThrow(Error);
  });

  it("should return user if password is valid", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUserData());
    (BCrypt.compare as jest.MockedFunction<typeof BCrypt.compare>).mockReturnValue(true);

    const user = await authService.login({ email: "test@example.com", password: "12345678" });

    expect(user.email).toBe("test@example.com");
  });

  it("should create a user if it doesn't exist", async () => {
    const data = mockUserData();

    // Mocks
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(data);
    (BCrypt.hash as jest.MockedFunction<typeof BCrypt.hash>).mockReturnValue(data.password);

    const user = await authService.register({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: data.email,
        password: expect.any(String),
        name: data.name,
      },
    });
    expect(user.email).toBe(data.email);
  });

  it("should throw an error if user already exists", async () => {
    const data = mockUserData();
    mockPrisma.user.findUnique.mockResolvedValue(data);

    expect(
      authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      })
    ).rejects.toThrow(Error);
  });
});
