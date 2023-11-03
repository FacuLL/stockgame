'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  
    return (
      <section className="border-red-500 mt-8 flex items-center justify-center">
      <div className="bg-gray-100 p-5 flex rounded-2xl shadow-lg w-full max-w-3xl mx-5">
        <div className="w-full px-5 py-3">
          <h2 className="text-2xl font-bold text-[#002D74]">Registrate</h2>
          <form className="mt-6">
            <div>
              <label className="block text-gray-700">Correo electrónico</label>
              <input type="email" name="email" id="email" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Nombre de usuario</label>
              <input type="text" name="username" id="username" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                    focus:bg-white focus:outline-none" required />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Nombre completo</label>
              <input type="text" name="name" id="name" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                    focus:bg-white focus:outline-none" required />
            </div>
    
            <div className="mt-4">
              <label className="block text-gray-700">Contraseña</label>
              <input type="password" name="password" id="password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                    focus:bg-white focus:outline-none" required />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Repetir contraseña</label>
              <input type="password" name="repeat-password" id="repeat-password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                    focus:bg-white focus:outline-none" required />
            </div>
    
            <div className="text-right mt-2">
              <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">¿Olvidaste tu contraseña?</a>
            </div>
    
            <button type="submit" className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                  px-4 py-3 mt-6">Registrate</button>
          </form>
  
          <div className="mt-7 grid grid-cols-3 items-center text-gray-500">
            <hr className="border-gray-500" />
            <p className="text-center text-sm">O</p>
            <hr className="border-gray-500" />
          </div>
  
          <div className="text-sm flex justify-center items-center mt-3">
            <p>Si ya tenés cuenta</p>
            <Link href="/login">
              <button className="py-2 px-5 ml-3 bg-white border rounded-xl hover:scale-110 duration-300">Iniciá sesión</button>
            </Link>
          </div>
        </div>
  
      </div>
    </section>
    )
  }
    