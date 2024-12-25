import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { signInSchema } from "@/domain/auth/schema";
import { handleZodValidation } from "@/lib/zodValidation";
import { toast } from "react-toastify";
import { signIn } from "@/auth";

interface SignInProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function SignInForm({ setIsModalOpen }: SignInProps) {
  const onSuccess = (res: typeof signInSchema['_output']) => {
    toast.promise(
      new Promise((resolve, reject) => {
        signIn("credentials", res)
          .then((res) => {
            console.log(res);
            resolve(res)
          })
          .catch((res) => {
            console.error(res);
            reject(res);
          })
      }),
      {
        pending: 'Logging in...',
        success: 'Login successful',
        error: 'Login failed',
      }
    )
    setIsModalOpen(false);
  }

  const onError = (error: Partial<Record<keyof typeof signInSchema['_output'], string>>) => {
    console.log(error);
  }

  const fields = [
    { name: 'email', placeholder: 'Enter email', type: 'email' },
    { name: 'password', placeholder: 'Enter password', type: 'password' },
  ]

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    handleZodValidation({
      onSuccess,
      onError,
      data,
      schema: signInSchema
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      {fields.map((field) => (
        <Input
          key={field.name}
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          className="h-12 text-lg rounded-xl"
        />
      ))}

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 rounded-xl font-semibold text-white">
        Entrar
      </Button>
    </form>
  )
}
