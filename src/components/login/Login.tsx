import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const { setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isResponseSuccess, setIsResponseSuccess] = useState(null);

  async function handleRegister(values: FieldValues) {
    await axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        localStorage.setItem("userToken", res.data.data.token);
        setUserToken(res.data.data.token);
        setIsResponseSuccess(res.data.message);

        setTimeout(() => {
          setIsResponseSuccess(null);
        }, 4000);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response?.data?.message);
        setTimeout(() => {
          setErrorMessage(null);
        }, 4000);
      });
  }

  const zodSchema = zod.object({
    email: zod
      .string()
      .nonempty("Email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid",
      ),
    password: zod
      .string()
      .nonempty("password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  });

  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h1 className='text-2xl font-bold text-center'>Login Now !</h1>
      {errorMessage && (
        <p className='rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-600'>
          {errorMessage}
        </p>
      )}
      {isResponseSuccess && (
        <p className='bg-green-400 w-full mx-auto p-3 text-center'>
          {isResponseSuccess}
        </p>
      )}
      <form
        onSubmit={handleSubmit(handleRegister)}
        className='flex flex-col gap-4 '
      >
        <div>
          <label className='font-bold'>
            Email:
            <input
              type='email'
              className='mt-1.5 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1877f2] focus:bg-white focus:ring-4 focus:ring-[#1877f2]/10'
              {...register("email")}
            />
          </label>
          {formState.touchedFields.email && formState.errors.email && (
            <p className='text-red-500'>
              {typeof formState.errors.email?.message == "string"
                ? formState.errors.email.message
                : ""}
            </p>
          )}
        </div>
        <div>
          <label className='font-bold'>
            Password:
            <input
              type='password'
              className='mt-1.5 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1877f2] focus:bg-white focus:ring-4 focus:ring-[#1877f2]/10'
              {...register("password")}
            />
          </label>
          {formState.touchedFields.password && formState.errors.password && (
            <p className='text-red-500'>
              {typeof formState.errors.password?.message == "string"
                ? formState.errors.password.message
                : ""}
            </p>
          )}
        </div>
        <button
          type='submit'
          className='w-full mt-2 rounded-2xl bg-[#1877f2] py-3 text-sm font-bold text-white shadow-lg shadow-[#1877f2]/20 transition hover:bg-[#166fe5] active:scale-[0.99] cursor-pointer'
        >
          Login
        </button>
      </form>
    </>
  );
}
