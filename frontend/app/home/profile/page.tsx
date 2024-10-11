"use client";
import React from "react";
import { useRouter } from "next/navigation"; 

export default function Page() {
  const router = useRouter(); 

  const handleLogout = () => {

    router.push("/");
  };

  return (
    <div className="h-screen p-6 overflow-hidden"> 
      <h1 className="text-4xl font-bold mb-12">Perfil pessoal</h1> 
      <div className="flex justify-between items-stretch mx-6 space-x-6 h-[calc(95vh-8rem)]">
        <div className="w-1/2 flex flex-col">
          <div className="flex flex-col space-y-6 h-full">
            <div className="h-1/2 bg-[#F7F7F7] rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                O usuário não possui dashboards no momento
              </p>
            </div>
            <div className="flex space-x-6 h-1/2">
              <div className="w-1/2 h-full bg-[#F7F7F7] rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  O usuário não possui dashboards no momento
                </p>
              </div>
              <div className="w-1/2 h-full bg-[#F7F7F7] rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  O usuário não possui dashboards no momento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-[#F7F7F7] rounded-lg p-6 flex flex-col justify-between">
          <div className="flex flex-col items-center mt-16"> 
            <div className="w-56 h-56 bg-gray-300 rounded-full mb-6"></div> 
            <h2 className="font-bold text-xl">Liderado</h2>
            <p className="text-gray-600">Liderado</p>
          </div>

          
          <div className="text-left space-y-4 mt-4 pl-8"> 
            <p className="text-lg"> 
              <strong>ID:</strong> 0003
            </p>
            <p className="text-lg">
              <strong>Nome:</strong> Liderado
            </p>
            <p className="text-lg">
              <strong>Idade:</strong> 28
            </p>
            <p className="text-lg">
              <strong>Email:</strong> liderado@exemplo.com
            </p>
            <p className="text-lg">
              <strong>Telefone:</strong> +5512999999999
            </p>
            <p className="text-lg">
              <strong>Função:</strong> Operação
            </p>
            <p className="text-lg">
              <strong>Local:</strong> São José dos Campos
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex items-center space-x-2"> 
        <img
          src="/images/bell logo.png"  
          alt="Ícone de sino"
          className="w-8 h-8" 
        />
        <button
          className="text-black bg-transparent hover:bg-gray-100"
          style={{
            width: "200px",  
            height: "65px",  
            fontSize: "22px",  
          }}
          onClick={handleLogout} 
        >
          Sair
        </button>
      </div>
    </div>
  );
}
