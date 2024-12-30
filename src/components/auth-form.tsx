'use client';

import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { handleZodValidation } from "@/lib/zodValidation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signInSchema, signUpSchema } from "@/domain/auth/schema";

interface SignUpProps {
  setIsModalOpen: (isOpen: boolean) => void;
  fields: {name: string, label?:string, placeholder:string, type?:string}[]
  buttonTitle: string,
  signSchema: typeof signInSchema | typeof signUpSchema, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signFunction: (credentials: any) => Promise<any>,
}

export default function AuthForm({setIsModalOpen, fields, buttonTitle, signSchema, signFunction }: SignUpProps) {
  const router = useRouter();
  const onSuccess = (res: typeof signSchema['_output']) => {
      toast.promise(
        () => signFunction(res),
        {
          pending: 'Aguarde...',
          success: 'Sucesso!',
          error: 'Ocorreu um erro!', 
        }
      )
      setIsModalOpen(false);
      router.push("/dashboard")
    }
  
    const onError = (error: Partial<Record<keyof typeof signSchema['_output'], string>>) => {
      console.log(error);
    }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    handleZodValidation({
      onSuccess,
      onError,
      data,
      schema: signSchema
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
        {buttonTitle}
      </Button>
    </form>
  )
}
