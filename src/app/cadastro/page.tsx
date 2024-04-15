"use client";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { validate } from "cpf-check";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const createCidadaoSchema = z.object({
  name: z
    .string()
    .min(4, "O nome tem que ser valído")
    .max(250)
    .nonempty("Nome OBRIGATÓRIO")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.slice(1));
        })
        .join(" ");
    }),
  cpf: z
    .string()
   .nonempty("CPF obrigatório"),
    //.refine((cpf) => {
    //  return validate(cpf);
    //}, "CPF inválido"),
  n_instalacao: z
    .string()
    .nonempty("O numero de instação e OBRIGATÓRIO")
    .min(5)
    .max(250),
  telefone: z.string().nonempty("O numero de telefone é OBRIGATÓRIO").min(14),
  endereco: z.string().nonempty("Endereço é OBRIGATÓRIO").min(8).max(250),
  n_casa: z.string().nonempty("o Numero da casa é OBRIGATÓRIO").min(2).max(10),
  bairro: z.string().nonempty("O bairro é OBRIGATÓRIO").min(6).max(250),
  ponto_referencia: z
    .string()
    .nonempty("O ponto de referência é OBRIGATÓRIO")
    .min(11)
    .max(250),
  email: z
    .string()
    .nonempty("E-mail OBRIGATÓRIO")
    .email("Formato de e-mail inválido")
    .toLowerCase()
    .refine((email) => {
      return email.endsWith("@gmail.com");
    }, "E-mail deve ser do gmail"),

  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function Cadastro() {
  const router = useRouter();
  const [output, setOutput] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCidadaoFormData>({
    resolver: zodResolver(createCidadaoSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const onSubmit = async (data: CreateCidadaoFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/cidadao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setOutput("Cadastro realizado com sucesso!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setOutput(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setOutput("Erro ao enviar formulário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  type CreateCidadaoFormData = z.infer<typeof createCidadaoSchema>;

  return (
    <main className=" flex  flex-col g-10 items-center justify-center">
      <h1>Cadastro</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            placeholder="Digite seu nome"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="cpf">CPF</label>
          <InputMask
            mask="999.999.999-99"
            placeholder="Digite seu CPF"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("cpf", {
              required: "CPF OBRIGATÓRIO",
              validate: (value) => validate(value) || "CPF inválido",
            })}
          />
          {errors.cpf && (
            <span className="text-red-500">{errors.cpf.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="n_instalacao">Numero de Instalação:</label>
          <input
            placeholder="Digite o numero de instalação"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("n_instalacao")}
          />
          {errors.n_instalacao && (
            <span className="text-red-500">{errors.n_instalacao.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="telefone">Telefone</label>
          <InputMask
            mask="(99) 99999-9999"
            placeholder="Digite seu telefone"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("telefone")}
          />
          {errors.telefone && (
            <span className="text-red-500">{errors.telefone.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="endereco">Endereço</label>
          <input
            placeholder="Digite seu endereço"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("endereco")}
          />
          {errors.endereco && (
            <span className="text-red-500">{errors.endereco.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="n_casa">Numero da casa</label>
          <input
            placeholder="Digite o numero da casa"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("n_casa")}
          />
          {errors.n_casa && (
            <span className="text-red-500">{errors.n_casa.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bairro">Bairro</label>
          <input
            placeholder="Digite seu bairro"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("bairro")}
          />
          {errors.bairro && (
            <span className="text-red-500">{errors.bairro.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ponto_referencia">Ponto de Referência</label>
          <input
            placeholder="Digite um ponto de referência"
            type="text"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("ponto_referencia")}
          />
          {errors.ponto_referencia && (
            <span className="text-red-500">
              {errors.ponto_referencia.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            placeholder="Digite seu e-mail"
            type="email"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("email")}
            maxLength={150}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            placeholder="Digite sua senha"
            type="password"
            className="borde border-gray-300 shadow-sm rounded h-10 px-3  "
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600 gap-2 px-3"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
