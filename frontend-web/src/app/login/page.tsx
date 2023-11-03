'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const router = useRouter();

  let [error, setError] = useState('');

  let { login } = useContext(AuthContext);

  const formLogin = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let data = {
      username: (document.querySelector('#username') as HTMLInputElement)?.value,
      password: (document.querySelector('#password') as HTMLInputElement)?.value
    }
    try {
      await login(data);
      router.push('/');
    }
    catch(err: any) {
      setError(err.message);
    }
  }

  return (
    <section className="border-red-500 mt-10 flex items-center flex-col justify-center">
    <div className="bg-gray-100 p-5 flex rounded-2xl shadow-lg w-full max-w-3xl mx-5">
      <div className="w-full md:w-1/2 px-5 py-3">
        <h2 className="text-2xl font-bold text-[#002D74]">Inicia sesión</h2>
        <form className="mt-6" onSubmit={(e) => formLogin(e)}>
          <div>
            <label className="block text-gray-700">Nombre de Usuario</label>
            <input type="text" name="username" id="username" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required />
          </div>
  
          <div className="mt-4">
            <label className="block text-gray-700">Contraseña</label>
            <input type="password" name="password" id="password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none" required />
          </div>
  
          <div className="text-right mt-2">
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">¿Olvidaste tu contraseña?</a>
          </div>
  
          <button type="submit" className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                px-4 py-3 mt-3">Iniciá sesión</button>
        </form>

        <div className="mt-2">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>

        <div className="mt-2 grid grid-cols-3 items-center text-gray-500">
          <hr className="border-gray-500" />
          <p className="text-center text-sm">O</p>
          <hr className="border-gray-500" />
        </div>

        <div className="text-sm flex justify-center items-center mt-3">
          <p>Si no tenés cuenta</p>
          <Link href="/register"><button className="py-2 px-5 ml-3 bg-white border rounded-xl hover:scale-110 duration-300">Registrate</button></Link>
        </div>
      </div>

      <div className="w-1/2 md:block hidden ml-4">
        <img src="/login-bg.jpg" className="rounded-2xl h-full" alt="page img" />
      </div>

    </div>
  </section>
  )
}
  