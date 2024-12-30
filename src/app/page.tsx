"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BsBookHalf, BsPeople, BsRocket } from "react-icons/bs";
import Image from "next/image";
import { motion } from "framer-motion";
import AuthForm from "@/components/auth-form";
import { login, register } from "@/actions/auth";
import { signUpSchema, signInSchema } from "@/domain/auth/schema";
import { useAuthUser } from "@/providers/authProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const { status } = useAuthUser();

  useEffect(() => {
    if(status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, status])

  const features = [
    {
      icon: <BsBookHalf className="text-3xl text-blue-500" />,
      title: "Organização Inteligente",
      description: "Sistema intuitivo para gerenciar seus estudos de forma eficiente"
    },
    {
      icon: <BsPeople className="text-3xl text-blue-500" />,
      title: "Comunidade Ativa",
      description: "Conecte-se com estudantes que compartilham seus objetivos"
    },
    {
      icon: <BsRocket className="text-3xl text-blue-500" />,
      title: "Recursos Exclusivos",
      description: "Ferramentas e conteúdos premium para impulsionar seu aprendizado"
    }
  ];

  const fields = isLogin ? [
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'password', placeholder: 'Senha', type: 'password' },
  ] : [
    { name: 'name', label: 'Full Name', placeholder: 'Seu nome completo' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'password', placeholder: 'Senha', type: 'password' },
  ] 

  const buttonTitle = isLogin ? 'Entrar' : 'Registre-se'
  const signFunction = isLogin ? login : register
  const signSchema = isLogin ? signInSchema : signUpSchema

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image src="/logo.png" alt="Logo" width={120} height={120} className="mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Sua Jornada Acadêmica<br />Começa Aqui
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Organize seus estudos, conecte-se com outros alunos e alcance seus objetivos acadêmicos.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              Começar Gratuitamente
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Junte-se a Milhares de Estudantes</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">50k+</div>
              <div className="text-gray-600">Materiais Compartilhados</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                {isLogin ? "Bem-vindo de Volta!" : "Crie Sua Conta"}
              </DialogTitle>
            </DialogHeader>
            <AuthForm setIsModalOpen={setIsModalOpen} fields={fields} buttonTitle={buttonTitle} signFunction={signFunction} signSchema={signSchema} />
            <p className="text-center mt-4">
              {isLogin ? (
                <span>
                  Novo por aqui?{" "}
                  <button
                    className="text-blue-600 hover:underline font-semibold"
                    onClick={() => setIsLogin(false)}
                  >
                    Criar conta
                  </button>
                </span>
              ) : (
                <span>
                  Já tem conta?{" "}
                  <button
                    className="text-blue-600 hover:underline font-semibold"
                    onClick={() => setIsLogin(true)}
                  >
                    Fazer login
                  </button>
                </span>
              )}
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
