import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const zodSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(20, "Name must be at most 20 characters long"),
    username: zod
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long"),
    email: zod
      .string()
      .nonempty("Email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid",
      ),
    password: zod
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    rePassword: zod
      .string()
      .nonempty("Password confirmation is required")
      .regex(
        passwordRegex,
        "Passwords do not match",
      ),
    dateOfBirth: zod
      .string()
      .nonempty("Date is required")
      .refine((userDate) => {
        const newUserDate = new Date(userDate);
        return new Date().getFullYear() - newUserDate.getFullYear() >= 18;
      }, "You must be at least 18 years old"),
    gender: zod
      .string()
      .nonempty("Gender is required")
      .regex(/^(male|female)$/, "Gender must be either male or female"),
  })
  .refine(
    (obj) => obj.password === obj.rePassword,
    {
      path: ["rePassword"],
      message: "Passwords do not match",
    },
  );

type RegisterValues = zod.infer<typeof zodSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResponseSuccess, setIsResponseSuccess] = useState<string | null>(null);

  const gender = [
    { key: "male", label: "Male" },
    { key: "female", label: "Female" },
  ];

  async function handleRegister(values: RegisterValues) {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );
      setIsResponseSuccess(res.data.message);
      setTimeout(() => {
        setIsResponseSuccess(null);
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message ?? "Registration failed. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  }

  const { handleSubmit, register, formState } = useForm<RegisterValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "onBlur",
  });

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className='space-y-1 text-center'>
        <h1 className='text-2xl font-black tracking-tight text-slate-900'>
          Register Now
        </h1>
        <p className='text-xs text-slate-700 font-bold'>
          Create a new account to join us
        </p>
      </div>

      {errorMessage && (
        <div className='rounded-2xl border border-red-200 bg-red-50/90 p-3 text-center text-xs font-semibold text-red-600'>
          {errorMessage}
        </div>
      )}

      {isResponseSuccess && (
        <div className='rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-center text-xs font-semibold text-emerald-600'>
          {isResponseSuccess}
        </div>
      )}

      <Form
        className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'
        onSubmit={handleSubmit(handleRegister)}
      >
        <div className='w-full'>
          <Input label='Full Name' type='text' {...register("name")} />
          {formState.touchedFields.name && formState.errors.name && (
            <p className='text-xs text-red-600 mt-1 pl-1'>
              {typeof formState.errors.name.message === "string"
                ? formState.errors.name.message
                : ""}
            </p>
          )}
        </div>

        <div className='w-full'>
          <Input label='Username' type='text' {...register("username")} />
          {formState.touchedFields.username && formState.errors.username && (
            <p className='text-xs text-red-600 mt-1 pl-1'>
              {typeof formState.errors.username.message === "string"
                ? formState.errors.username.message
                : ""}
            </p>
          )}
        </div>

        <div className='w-full'>
          <Input label='Email' type='email' {...register("email")} />
          {formState.touchedFields.email && formState.errors.email && (
            <p className='text-xs text-red-600 mt-1 pl-1'>
              {typeof formState.errors.email.message === "string"
                ? formState.errors.email.message
                : ""}
            </p>
          )}
        </div>

        <div className='w-full'>
          <Input
            label='Date of Birth'
            type='date'
            {...register("dateOfBirth")}
          />
          {formState.touchedFields.dateOfBirth &&
            formState.errors.dateOfBirth && (
              <p className='text-xs text-red-600 mt-1 pl-1'>
                {typeof formState.errors.dateOfBirth.message === "string"
                  ? formState.errors.dateOfBirth.message
                  : ""}
              </p>
            )}
        </div>

        <div className='w-full'>
          <Input label='Password' type='password' {...register("password")} />
          {formState.touchedFields.password && formState.errors.password && (
            <p className='text-xs text-red-600 mt-1 pl-1'>
              {typeof formState.errors.password.message === "string"
                ? formState.errors.password.message
                : ""}
            </p>
          )}
        </div>

        <div className='w-full'>
          <Input
            label='Confirm Password'
            type='password'
            {...register("rePassword")}
          />
          {formState.touchedFields.rePassword &&
            formState.errors.rePassword && (
              <p className='text-xs text-red-600 mt-1 pl-1'>
                {typeof formState.errors.rePassword.message === "string"
                  ? formState.errors.rePassword.message
                  : ""}
              </p>
            )}
        </div>

        <div className='w-full md:col-span-2'>
          <Select label='Gender' {...register("gender")}>
            {gender.map((g) => (
              <SelectItem key={g.key}>{g.label}</SelectItem>
            ))}
          </Select>
          {formState.touchedFields.gender && formState.errors.gender && (
            <p className='text-xs text-red-600 mt-1 pl-1'>
              {typeof formState.errors.gender.message === "string"
                ? formState.errors.gender.message
                : ""}
            </p>
          )}
        </div>

        <div className='w-full md:col-span-2 mt-2'>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            type='submit'
            className='w-full rounded-2xl bg-[#1877f2] py-6 text-sm font-bold text-white shadow-lg shadow-[#1877f2]/30 transition hover:bg-[#166fe5]'
          >
            Register
          </Button>
        </div>
      </Form>

      <p className='text-center text-sm text-slate-600'>
        Already have an account?{" "}
        <Link to='/login' className='text-[#1877f2] font-semibold hover:underline'>
          Login
        </Link>
      </p>
    </>
  );
}
