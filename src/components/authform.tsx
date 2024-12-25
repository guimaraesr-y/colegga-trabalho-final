'use client';

import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { signUpSchema } from "@/domain/auth/schema";
import { handleZodValidation } from "@/lib/zodValidation";
import { toast } from "react-toastify";
import { signIn } from "@/auth";
import { register } from "@/actions/auth";
import { ZodObject } from "zod";

interface SignUpProps {
  setIsModalOpen: (isOpen: boolean) => void;
  fields: {name: string, label?:string, placeholder:string, type?:string}[]
  buttonTitle: string,
  signSchema: ZodObject<any>, 
  signFunction: (credentials: any) => Promise<any>,
}

export default function AuthForm({setIsModalOpen, fields, buttonTitle, signFunction }: SignUpProps) {

  const onSuccess = (res: typeof signUpSchema['_output']) => {
      toast.promise(
        new Promise((resolve, reject) => {
          register(res)
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
          pending: 'Registrando...',
          success: 'Registrado com sucesso!',
          error: 'Ocorreu um erro ao registrar você!', 
        }
      )
      setIsModalOpen(false);
    }
  
    const onError = (error: Partial<Record<keyof typeof signUpSchema['_output'], string>>) => {
      console.log(error);
    }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    handleZodValidation({
      onSuccess,
      onError,
      data,
      schema: signUpSchema
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

      <Button onClick={signFunction} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 rounded-xl font-semibold text-white">
        {buttonTitle}
      </Button>
    </form>
  )
}
